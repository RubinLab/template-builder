export default function createID() {
  const id = Math.random()
    .toString(16)
    .substr(2, 8);
  return id;
}
