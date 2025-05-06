import { Command } from "commander";
import { convertFileToBase64 } from "./encrypt";

const program = new Command();

program
  .command("encrypt")
  .description("Encrypt a file")
  .option("-f, --file <path>", "path to the file to be encrypted")
  .action((options, path) => {
    if (options.file) {
      const filePath = path.rawArgs[3];

      convertFileToBase64(filePath);
    } else {
      console.error("Please provide a file path using -f or --file.");
      return;
    }
  })
  .parse(process.argv);
