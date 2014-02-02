Citationer - cite differently
========

```bash
$ citationer init
Created citations.json

$ citationer -s en.wikipedia.org/wiki/pH
pH - Wikipedia, the free encyclopedia. Wikimedia Foundation. Web. Sat Feb 01 2014. <http://en.wikipedia.org/wiki/pH>.

$ citationer -l
pH - Wikipedia, the free encyclopedia. Wikimedia Foundation. Web. Sat Feb 01 2014. <http://en.wikipedia.org/wiki/pH>. 
Hydrogen - Wikipedia, the free encyclopedia. Wikimedia Foundation. Web. Sat Feb 01 2014. <http://en.wikipedia.org/wiki/Hydrogen>. 

$ citationer -e citations.txt
Exported as citations.txt

$ citationer -s en.wikipedia.org/wiki/Node.js --json
{
  "title": "Node.js - Wikipedia, the free encyclopedia",
  "organization": "Wikimedia Foundation",
  "lastModDate": null,
  "type": "Web",
  "accessDate": "Sun Feb 02 2014",
  "url": "<http://en.wikipedia.org/wiki/Node.js>"
}
```

Are you tired of using clunky web sites or word processors
to manage your references?

Keep them simple, and local.

If a citations.json is found in the current directory, Citationer
will automatically append all citations to it before printing.
Otherwise, everything will go to stdout.

## License

Citationer is available under the MIT license.
