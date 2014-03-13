var argv = require("optimist").argv,
    fs = require("fs"),
    Citation = require("citation.js");

var style = "MLA";
var referenceFile;

if (argv.j || argv.json)
  style = "JSON";

if (fs.existsSync("citations.json"))
  referenceFile = "citations.json";

if (argv.f || argv.file)
  referenceFile = argv.f || argv.file;

/*
  citationer init - create a citations.json
  if none has already been created.
*/
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
    console.error("citations.json already exists. Not overwriting.");
  }
}
/*
  citationer [-s|--site] branches.io
  Fetch the site.
*/
else if (argv.s || argv.site || argv._[0]) {
  var site = argv.s || argv.site || argv._[0];
  
  var URI;
  
  if (!(/^https?\:\/\//.test(site)))
    URI = "http://" + site;
  else
    URI = site;
  
  var citation = new Citation(URI);
  citation.getReference(function(err, reference) {
    if (err) throw err;
    
    /* Always print to console */
    
    if (style === "MLA")
      console.log(Citation.convertToMla(reference));
    else if (style === "JSON")
      console.log(JSON.stringify(reference, null, 2));
    
    /* And if a citations.json exits, write to it */
    
    if (referenceFile) {
      try {
        /* read reference file, and push new reference into it, write */
        
        var references = JSON.parse(fs.readFileSync(referenceFile));
        references.push(reference)
        fs.writeFileSync(referenceFile, JSON.stringify(references, null, 2));
      } 
      catch (err) {
        throw err;
      }
    }
  });
}
/*
citationer -l|--list
*/
else if (argv.l || argv.list) {
  if (fs.existsSync(referenceFile)) {
    var citations = JSON.parse(fs.readFileSync(referenceFile));
    var citer = new Citation();
    citations.forEach(function(citation) {
      if (style === "MLA")
        console.log(Citation.convertToMla(citation));
      else if (style === "JSON")
        console.log(citation);
    });
  }
}
/*
citationer -e|--export [name]
Export the citations as MLA.
*/
else if (argv.e || argv.export) {
  var exportfile = (argv.e || argv.exportfile);

  if (fs.existsSync(referenceFile)) {
    var citations = JSON.parse(fs.readFileSync(referenceFile));
    var output = "";
    
    citations.forEach(function(citation) {
      output += Citation.convertToMla(citation) + "\n";
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
}
else if (argv.h || argv.help || true) {
  fs.createReadStream(__dirname + "/help.txt")
  .pipe(process.stdout);
}
