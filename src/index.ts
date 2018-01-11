export interface Replacer<T> {
  regexp: RegExp;
  replace: (index: number, ...match: string[]) => T;
}

function replaceFragment<T>(replacer: Replacer<T>, fragment: string) {
  const { regexp, replace } = replacer;
  if (!regexp.global) {
    throw new Error("regular expression must be a global match");
  }

  const elements: Array<string | T> = [];

  let lastIndex = 0;
  regexp.lastIndex = lastIndex;

  let match = regexp.exec(fragment);

  if (match == null) {
    return fragment;
  }

  do {
    const index = match.index;
    const text = match[0];

    // Push preceding text if any.
    if (index > lastIndex) {
      elements.push(fragment.substring(lastIndex, index));
    }

    // Append link to result.
    elements.push(replace(index, ...match));

    // Update last index.
    lastIndex = index + text.length;

    // Run match again.
    match = regexp.exec(fragment);
  } while (match != null);

  // Push remaining text if any.
  if (lastIndex < fragment.length) {
    elements.push(fragment.substring(lastIndex));
  }

  return elements;
}

function replaceFragments<T>(
  replacer: Replacer<T>,
  fragments: Array<string | T>,
) {
  return fragments.reduce(
    (memo, fragment) => {
      return memo.concat(
        typeof fragment === "string"
          ? replaceFragment(replacer, fragment)
          : fragment,
      );
    },
    [] as Array<string | T>,
  );
}

export function replaceAll<T>(replacers: Array<Replacer<T>>, str: string) {
  return replacers.reduce(
    (memo, replacer) => {
      return replaceFragments(replacer, memo);
    },
    [str] as Array<string | T>,
  );
}
