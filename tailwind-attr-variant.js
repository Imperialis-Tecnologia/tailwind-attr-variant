const pseudoClassesModifiers = [
  "hover",
  "focus",
  "focus-within",
  "focus-visible",
  "active",
  "visited",
  "target",
  "first",
  "last",
  "only",
  "odd",
  "even",
  "first-of-type",
  "last-of-type",
  "only-of-type",
  "empty",
  "disabled",
  "enabled",
  "checked",
  "indeterminate",
  "default",
  "required",
  "valid",
  "invalid",
  "in-range",
  "out-of-range",
  "placeholder-shown",
  "autofill",
  "read-only",
  "before",
  "after",
  "first-letter",
  "first-line",
  "marker",
  "selection",
  "file",
  "backdrop",
  "rtl",
  "ltr",
  "open",
  "placeholder",
];

const mediaModifiers = [
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "min-[",
  "max-[",
  "max-sm",
  "max-md",
  "max-lg",
  "max-xl",
  "max-2xl",
  "dark",
  "portrait",
  "landscape",
  "motion-safe",
  "motion-reduce",
  "contrast-more",
  "contrast-less",
  "print",
];
module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path) {
        const attributesToRemove = [];
        const newClasses = [];

        path.node.attributes.forEach((attribute) => {
          if (t.isJSXAttribute(attribute) && attribute.name) {
            const attributeName = attribute.name.name;

            // Combina as duas listas para simplificar a lógica
            const allModifiers = [...pseudoClassesModifiers, ...mediaModifiers];

            if (allModifiers.includes(attributeName)) {
              // Assegura que o valor está definido, seja diretamente ou através de expressão
              let value = attribute.value.value;
              if (!value && attribute.value.expression) {
                value =
                  attribute.value.expression.type === "StringLiteral"
                    ? attribute.value.expression.value
                    : "";
              }

              if (value) {
                const tailwindClass = `${attributeName}:${value}`;
                newClasses.push(tailwindClass);
                attributesToRemove.push(attribute);
              }
            }
          }
        });

        // Modifica ou adiciona o atributo className
        if (newClasses.length > 0) {
          const existingClassAttribute = path.node.attributes.find(
            (attr) => attr.name.name === "className"
          );
          if (existingClassAttribute) {
            existingClassAttribute.value.value += ` ${newClasses.join(" ")}`;
          } else {
            path.node.attributes.push(
              t.jSXAttribute(
                t.jSXIdentifier("className"),
                t.stringLiteral(newClasses.join(" "))
              )
            );
          }
        }

        // Remove os atributos processados
        attributesToRemove.forEach((attr) =>
          path.node.attributes.splice(path.node.attributes.indexOf(attr), 1)
        );
      },
    },
  };
};
