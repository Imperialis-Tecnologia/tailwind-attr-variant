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
            if (t.isJSXAttribute(attribute) && attribute.name && attribute.name.name) {
              const attributeName = attribute.name.name;
  
              const allModifiers = [...pseudoClassesModifiers, ...mediaModifiers];
  
              if (allModifiers.includes(attributeName)) {
                let values = [];
                if (attribute.value.type === 'StringLiteral') {
                  values = attribute.value.value.split(/\s+/);
                } else if (attribute.value.type === 'JSXExpressionContainer' && attribute.value.expression.type === 'StringLiteral') {
                  values = attribute.value.expression.value.split(/\s+/);
                }
  
                values.forEach(value => {
                  if (value) {
                    const tailwindClass = `${attributeName}:${value}`;
                    newClasses.push(tailwindClass);
                  }
                });
  
                attributesToRemove.push(attribute);
              }
            }
          });
  
          if (newClasses.length > 0) {
            const existingClassAttribute = path.node.attributes.find(attr => attr.name && attr.name.name === "className");
            if (existingClassAttribute) {
              if (existingClassAttribute.value.type === 'StringLiteral') {
                existingClassAttribute.value.value += ` ${newClasses.join(" ")}`;
              } else if (existingClassAttribute.value.type === 'JSXExpressionContainer' && existingClassAttribute.value.expression.type === 'StringLiteral') {
                existingClassAttribute.value.expression.value += ` ${newClasses.join(" ")}`;
              }
            } else {
              path.node.attributes.push(
                t.jSXAttribute(
                  t.jSXIdentifier("className"),
                  t.stringLiteral(newClasses.join(" "))
                )
              );
            }
          }
  
          attributesToRemove.forEach(attr => path.node.attributes.splice(path.node.attributes.indexOf(attr), 1));
        },
      },
    };
  };