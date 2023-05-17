import * as fs from "node:fs/promises"

(async () => {
  const createFile = async (path) => {
    let exists
    try {
      exists = await fs.open(path, "r")
      exists.close();
      return console.log(`This file ${path} already exists`)
    } catch (error) {
      const newFile = await fs.open(path, "w");
      console.log("A new file was successfully created")
      newFile.close();
    }
  }
  //commands 
  const CREATE_FILE = "create a file"
  const DELETE_FILE = "delete file"

  const commandFile = await fs.open('./command.txt', "r")

  commandFile.on("change", async () => {
    const { size } = await commandFile.stat();
    const buff = Buffer.alloc(size);
    // the location at which we want to starting filling our buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading the file from
    const position = 0;

    await commandFile.read(buff, offset, length, position);
    const command = buff.toString("utf-8")

    //create a file: 
    //create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

  })

  const watcher = fs.watch("./command.txt")
  // watcher...
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFile.emit("change");
    }
  }
})()


