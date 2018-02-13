import { replaceAny, Replacer } from ".";

describe("replace-any", () => {
  beforeEach(() => {
    expect.assertions(1);
  });

  describe(".replaceAny", () => {
    describe("with a non-global regular expression", () => {
      it("throws", () => {
        const str = "foo abc bar";
        const replacers: Array<Replacer<string>> = [
          {
            regexp: /abc/,
            replace: (_key: string, text: string) =>
              text.replace("abc", "def"),
          },
        ];

        const func = () => {
          replaceAny(replacers, str);
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
            replace: (_key: string, _text: string, group: string) => group,
          },
        ];
        expect(replaceAny(replacers, str)).toEqual(["foo ", "bbb", " bar"]);
      });

      it("applies multiple replacers", () => {
        const str = "foo abc bar";
        const replacers: Array<Replacer<object | string>> = [
          {
            regexp: /abc/g,
            replace: (_key: string, text: string) =>
              text.replace("abc", "bar"),
          },
          {
            regexp: /bar/g,
            replace: (_key: string, text: string) => ({
              value: text.replace("bar", "baz"),
            }),
          },
          {
            regexp: /foo/g,
            replace: () => "qux",
          },
        ];
        expect(replaceAny(replacers, str)).toEqual([
          "qux",
          " ",
          { value: "baz" },
          " ",
          { value: "baz" },
        ]);
      });

      it("assigns unique keys to replaced entities", () => {
        const str = "foo\nfoo\nfoo";
        const replacers = [
          {
            regexp: /\n/g,
            replace: (key: string) => `bar-${key}`,
          },
          {
            regexp: /foo/g,
            replace: (key: string, text: string) =>
              text.replace("foo", `baz-${key}`),
          },
        ];
        expect(replaceAny(replacers, str)).toEqual([
          "baz-1:0:0",
          "bar-0:0:3",
          "baz-1:2:0",
          "bar-0:0:7",
          "baz-1:4:0",
        ]);
      });
    });
  });
});
