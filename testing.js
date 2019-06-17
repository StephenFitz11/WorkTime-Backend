const data = [
  {
    name: "bill",
    alias: "william,"
  },
  {
    name: "james",
    alias: "jim"
  }
];

data.map(item => {
  item["key"] = 1;
});

console.log(data);
