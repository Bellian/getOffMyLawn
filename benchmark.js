var glob = require("glob");
var path = require("path");
var execSync = require("child_process").execSync;

// options is optional
glob("./bin/**/*.benchmark.js", {}, function (err, files) {
    if(err || files === null) {
        return;
    };
    for(let file of files){
        console.log('Benchmark', path.basename(file, ".benchmark.js").toUpperCase(), ':');
        require(file);
        console.log('');
    }
});
