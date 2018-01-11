import { replaceAll, Replacer } from ".";

describe("replace-any", () => {
  beforeEach(() => {
    expect.assertions(1);
  });

  describe(".replaceAll", () => {
    describe("with a non-global regular expression", () => {
      it("throws", () => {
        const str = "foo abc bar";
        const replacers: Array<Replacer<string>> = [
          {
            regexp: /abc/,
            replace: (_index: number, text: string) =>
              text.replace("abc", "def"),
          },
        ];

        const func = () => {
          replaceAll(replacers, str);
        };
        expect(func).toThrowError("regular expression must be a global match");
      });
    });

    describe("with global regular expressions", () => {
      it("applies a single replacers", () => {
        const str = "foo abbbc bar";
        const replacers: Array<Replacer<string>> = [
          {
            regexp: /a(b+)c/g,
            replace: (_index: number, _text: string, group: string) => group,
          },
        ];
        expect(replaceAll(replacers, str)).toEqual(["foo ", "bbb", " bar"]);
      });

      it("applies multiple replacers", () => {
        const str = "foo abc bar";
        const replacers: Array<Replacer<object | string>> = [
          {
            regexp: /abc/g,
            replace: (_index: number, text: string) =>
              text.replace("abc", "bar"),
          },
          {
            regexp: /bar/g,
            replace: (_index: number, text: string) => ({
              value: text.replace("bar", "baz"),
            }),
          },
          {
            regexp: /foo/g,
            replace: () => "qux",
          },
        ];
        expect(replaceAll(replacers, str)).toEqual([
          "qux",
          " ",
          { value: "baz" },
          " ",
          { value: "baz" },
        ]);
      });
    });
  });
});
