
use SnippetShareServer;
db.Files.drop();
db.Users.drop();
db.createCollection("Files");
db.createCollection("Users");

db.Files.insert(
[
  {username: "user", fileName: "test", content: "# Hello world! ", visible: true, created: 1598081755721, modified: 1598081755721},
  {username: "user", fileName: "test.txt", content: "Hello world! ", visible: true, created: 1598081755721, modified: 1598081755721},
  {username: "user", fileName: "test.md", content: "### Hello world!!!! ", visible: false, created: 1598081755721, modified: 1598081755721},
]
);

db.Files.createIndex({username: 1, fileName: 1});


