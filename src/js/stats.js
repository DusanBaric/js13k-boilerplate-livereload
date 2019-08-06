//=require node_modules/stats.js/build/stats.min.js

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/*
stats.begin();

// monitored code goes here

stats.end();
*/