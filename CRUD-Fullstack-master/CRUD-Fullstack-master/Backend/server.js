const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new  sqlite3.Database("empresa.db", (err)=>{
    if(err){
        console.error(err);
    }else{
        console.log("Conexão estabelecida com sucesso.")
    }
});


// Function to drop the existing Produtos table (if it exists)
const dropExistingProdutosTable = () => {
    db.run("DROP TABLE IF EXISTS Produtos", (err) => {
      if (err) {
        console.error("Error dropping existing Produtos table:", err);
      } else {
        console.log("Produtos table dropped (if it existed).");
      }
    });
  };
  
// Create the new Produtos table with CategoryName column
 const createProdutosTable = () => {
    db.run(
     `CREATE TABLE IF NOT EXISTS Produtos(
      ProductID INTEGER PRIMARY KEY AUTOINCREMENT,
      ProductName TEXT,
      CategoryName TEXT,
      Amount FLOAT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating Produtos table:", err);
      } else {
        console.log("Produtos table created successfully.");
      }
    }
  );
};
  
// Call the functions in sequence
dropExistingProdutosTable();
createProdutosTable();
  
const search = (callback)=>{
    db.all("SELECT * FROM produtos", (err, rows)=>{
        if(err){
            console.error(err);
        }else{
            callback(rows);
        }
    });
};

const insertData = db.prepare(
    `INSERT INTO Produtos (ProductName, CategoryName, Amount)
    VALUES (?, ?, ?)`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data successfully inserted.");
        }
    }
);

const deleteData = db.prepare(
    `DELETE FROM Produtos WHERE ProductID == ?`,
    (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data successfully deleted.");
        }
    }
);

const modifyData = db.prepare(
    `UPDATE Produtos
      SET ProductName = ?,
          CategoryName = ?,
          Amount = ?
     WHERE ProductID = ?`,
     (err)=>{
        if(err){
            console.error(err);
        }else{
            console.log("Data successfully modified.");
        }
     }
);

const server = http.createServer((req, res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    search((result)=>{
        res.write(JSON.stringify(result));
        res.end();
    });
    
    if(req.method === "POST"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            insertData.run(
                parsedBody.ProductName,
                parsedBody.CategoryName,
                parsedBody.Amount
            );
            console.log("Data successfully created.");
        });

        
    }else if(req.method === "DELETE"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            deleteData.run(parsedBody.ProductID);
            console.log("Data successfully deleted");
        });
    }else if(req.method === "PUT"){
        let body = "";
        req.on("data", (chunk)=>{
            body += chunk;
        });
        req.on("end", ()=>{
            const parsedBody = JSON.parse(body);
            console.log(parsedBody);
            modifyData.run(
                parsedBody.ProductID,
                parsedBody.ProductName,
                parsedBody.CategoryName,
                parsedBody.Amount,
            );
            console.log("Dados modificados com sucesso.");
        });
    }

});
const port = 3000;
server.listen(port);
console.log(`Servidor escutando no porto ${port}`)