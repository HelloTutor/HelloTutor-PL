const sample = [
  {
    "type":"p",
    "attributes":{},
    "children":[
      {
        "type":"text",
        "textContent":"asdf"
      }
    ]
  },
  {
    "type":"p",
    "attributes":{},
    "children":[
      {
        "type":"br",
        "attributes":{},
        "children":[]
      }
    ]
  },
  {
    "type":"p",
    "attributes":{},
    "children":[
      {
        "type":"text",
        "textContent":"asdf"
      },
      {
        "type":"span",
        "attributes":{
          "style":"color: rgb(230, 0, 0);"
        },
        "children":[
          {
            "type":"text",
            "textContent":"test"
          }
        ]
      }
    ]
  }
];

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "hellotutor",
  password: "0000",
  database: "HELLOTUTOR"
});

class Board{
  constructor(id,title,writer_id) {
    this.id=id;
    this.title=title;
    this.writer_id=writer_id;
    this.created_at = new Date();
  }
}

class BoardLine{
  constructor(board,parent,idx,type,attributes,text_content) {
    this.board_id = board.id;
    this.idx=idx;
    this.type=type;
    this.attributes=attributes;
    this.text_content=text_content;
    this.parent_id=parent?parent.id:null;
  }
}

async function parse(){
  const board = new Board(1,'테스트',1);
  await pool.getConnection().then(con=>{
    const [result] = con.execute("INSERT INTO `board` (`title`,`writer_id`) VALUES(?,?)",[board.title,board.writer_id]);
    board.id=result.insertId;
  });
  return sample.map((line,idx)=> lineParser(board,null,line,idx))
}

function lineParser(board,parent, line, idx){
  const data =  new BoardLine(board,parent,idx,line.type,JSON.stringify(line.attributes),line.textContent);
  pool.getConnection().then(con=>{
    con.execute("INSERT INTO `board_line` (`board_id`,`idx`,`type`,`attributes`,`text_content`,`parent_id`) VALUES (?,?,?,?,?,?)",[data.board_id,data.idx,data.type,data.attributes,data.text_content,data.parent_id]);
    if(line.children){
      data.children = line.children.map((child,idx)=> lineParser(board,parent,child,idx));
    }
  })
  return data;
}

console.log(JSON.stringify(parse()));