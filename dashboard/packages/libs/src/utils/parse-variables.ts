/**
 * description: Parse variables in a template string with the format {{variable}} {{variable1}} {{variable_1}} {{variableName}}
 * @param template
 * @param variables
 * @returns
 */

export const parseVariables = (
  template: string,
  variables: Record<string, string>,
): string =>
  template.replace(
    /{{([a-zA-Z0-9_]+?)}}/g,
    (_unused, varName) => variables[varName] ?? '',
  );
