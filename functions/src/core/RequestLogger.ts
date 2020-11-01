import Logger from "./Logger";
class MyStream {
  write(text: string) {
    Logger.info(text.replace(/\n$/, ""));
  }
}
export default new MyStream();
