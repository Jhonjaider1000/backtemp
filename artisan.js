const packageObject = require("./package.json");
const argsCommand = process.argv;
const api = require("./bin/process/artisan/api");

let args = [];
if (packageObject.scripts && packageObject.scripts.artisan) {
  const parts = packageObject.scripts.artisan.split(/\s+/);
  argsCommand.forEach((arg) => {
    if (!parts.includes(arg)) {
      args.push(arg);
    }
  });
}

console.log(
  "\x1b[33m%s\x1b[0m",
  `
------------------------------------------------
                ARTISAN CONSOLE.
------------------------------------------------
`
);

if (args.length > 2) {
  api.commandController(args);
} else {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `
* Este proceso te permite realizar las siguientes operaciones con los siguientes comandos:

- Generar todos los modelos: node artisan make:model --all
- Generar o actualizar modelos específico: node artisan make:model <name_table>
`
  );
  process.exit(0);
}
