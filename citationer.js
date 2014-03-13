var argv = require("optimist").argv,
    fs = require("fs"),
    Citation = require("citation.js");

var style = "MLA",
    referenceFile;

if (argv.j || argv.json)
  style = "JSON";

if (fs.existsSync("citations.json"))
  referenceFile = "citations.json";

if (argv.f || argv.file)
  referenceFile = argv.f || argv.file;

if (process.argv[2] === "init") {
  if (!fs.existsSync("citations.json")) {
    try {
      fs.writeFileSync("citations.json", "[]");
    }
    catch(err) {
      throw err;
    }
    console.log("Created citations.json");
  }
  else {
    console.error("citations.json already exists. Refusing to overwrite.");
  }
}
else if (argv.s || argv.site) {
  var site = argv.s || argv.site;
  var URI;

  if (!(/^https?\:\/\//.test(site)))
    URI = "http://" + site;
  else
    URI = site;
  
  var citation = new Citation(URI);
  citation.getReference(function(err, reference) {
    if (err) throw err;
    if (style === "MLA")
      console.log(citation.convertToMla(reference));
    else if (style === "JSON")
      console.log(JSON.stringify(reference, null, 2));
    if (referenceFile) {
      try {
        var references = JSON.parse(fs.readFileSync(referenceFile));
        references.push(reference)
        try {
          fs.writeFileSync(referenceFile, JSON.stringify(references, null, 2));
        }
        catch (err) {
          throw err;
        }
      } 
      catch (err) {
        throw err;
      }
    }
  });
}
else if (argv.l || argv.list) {
  var citations = JSON.parse(fs.readFileSync(referenceFile));
  var citer = new Citation();
  citations.forEach(function(citation) {
    console.log(citer.convertToMla(citation));
  });
}
else if (argv.e || argv.export) {
  var exportfile = (argv.e || argv.exportfile);
  console.log("export:", exportfile);
  var citations = JSON.parse(fs.readFileSync(referenceFile));
  var citer = new Citation();
  var output = "";
  citations.forEach(function(citation) {
    output += citer.convertToMla(citation) + "\n";
  });
  try {
    if (typeof(exportfile) === "string")
      fs.writeFileSync(exportfile, output);
    else
      fs.writeFileSync(__dirname + "/citations.txt", output);
  }
  catch (err) {
    throw err;
  }
  if (typeof(exportfile) === "string")
    console.log("Exported as", exportfile);
  else
    console.log("Exported as citations.txt");
}
else if (process.argv[2] !== "init") {
  fs.createReadStream(__dirname + "/help.txt")
  .pipe(process.stdout);
}

