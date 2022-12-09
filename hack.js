const { readFile, writeFile } = require("fs/promises");

const file = "./node_modules/react-native-os/android/build.gradle";

(async () => {
  const content = await readFile(file, "utf8");

  const newContent = content
    .split(`compile 'com.facebook.react:react-native:+'`)
    .join(`implementation 'com.facebook.react:react-native:+'`);

  await writeFile(file, newContent, "utf8");

  console.log("[[[CUSTOM HACK COMPLETED]]]");
})();
