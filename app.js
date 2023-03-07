const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const app = express();

//problem statements.
const knap = "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. In other words, given two integer arrays val[0..n-1] and wt[0..n-1] which represent values and weights associated with n items respectively. Also given an integer W which represents knapsack capacity, find out the maximum value subset of val[] such that sum of the weights of this subset is smaller than or equal to W. You cannot break an item, either pick the complete item, or don’t pick it (0-1 property).";
const allpair = "The Floyd Warshall Algorithm is for solving the All Pairs Shortest Path problem. The problem is to find shortest distances between every pair of vertices in a given edge weighted directed Graph.";
const longest = "The Longest Increasing Subsequence (LIS) problem is to find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.";
const lcs= "Print the longest common subsequence of two strings ";

//time complexities,
const tcknap = "The time complexity of this algorihtm is O(n*W), where n is number of items and W is the total capacity."
const tclong = "The time complexity of this algorithm is O(n^2), where n is the size of array."
const tcallpair = "The time complexity of this algorithm is O(V^3), where V is the number of vertices.";
const tclcs="The time complexity of this algorithm is O(n*m) where n and m are length of string str1 and str2 respectively."

let errormessage;
let out;

//knapsack function
function knapsackprob(weight, value, capacity, size) {
  let dp = new Array(parseInt(capacity) + 1);
  dp.fill(0, 0, capacity + 1);
  for (let i = 0; i < size; i++) {
    for (let j = capacity; j >= weight[i]; j--) {
      if (dp[j] < value[i] + dp[j - weight[i]]) {
        dp[j] = value[i] + dp[j - weight[i]];
      }
    }
  }
  return dp[capacity];
}

//LIS function
function longinc(size, arr) {
  let dp = new Array(parseInt(size));
  dp.fill(1, 0, size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        if (dp[i] < dp[j] + 1) {
          dp[i] = dp[j] + 1;
        }
      }
    }
  }
  let ans = 0;
  for (let i = 0; i < size; i++) {
    if (ans < dp[i]) {
      ans = dp[i];
    }
  }
  return ans;
}

//LCS FUNCTION
function printLCS(str1, str2) {
  let m = str1.length;
  let n = str2.length;

  let lcs = new Array(m + 1);
  for (let i = 0; i <= m; i++) {
    lcs[i] = new Array(n + 1).fill(0);
  }

  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] == str2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }

  
  let index = lcs[m][n];
  let lcsStr = new Array(index + 1).fill('');
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] == str2[j - 1]) {
      lcsStr[index - 1] = str1[i - 1];
      i--;
      j--;
      index--;
    } else if (lcs[i - 1][j] > lcs[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
console.log(lcsStr);
let ans = "";
for (let i = 0; i < lcsStr.length; i++) {
  ans+= lcsStr[i];
}
  return ans;
}

//FLOYS WARSHALL
function allpairproblem(V, graph) {
  let dist = new Array(V);
  for (let i = 0; i < V; i++) {
    dist[i] = new Array(V);
  }

  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      dist[i][j] = graph[i][j];
    }
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      if (dist[i][j] >= 9999) {
        dist[i][j] = "INF";
      }
    }
  }
  return dist;
}


app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//home route
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/home.html");
});

//get requests of questions
app.get("/knapsack", function(req, res) {
  res.render("question", {
    questioname: knap,
    tc: tcknap,
    title: "0/1 Knapsack Problem"
  });
});

app.get("/longest", function(req, res) {
  res.render("question", {
    questioname: longest,
    tc: tclong,
    title: "Longest Increasing Subsequence"
  });
});

app.get("/printLCS",function(req,res){
  res.render("question",{
    questioname:lcs,
    tc:tclcs,
    title:"Print LCS"
  });
})

app.get("/allpair", function(req, res) {
  res.render("question", {
    questioname: allpair,
    tc: tcallpair,
    title: "All Pair Shortest Path"
  });
});

//get requests of outputs
app.get("/outputknap", function(req, res) {
  res.render("output", {
    out: out,
    title: "0/1 Knapsack",
    tc: tcknap
  });
});

app.get("/outputlong", function(req, res) {
  res.render("output", {
    out: out,
    title: "Longest Increasing Subsequence",
    tc: tclong
  });
});

app.get("/outputlcs",function(req,res){
  res.render("output",{
    out:out,
    title:"Print LCS",
    tc:tclcs
  })
})



app.get("/outputallpair", function(req, res) {
  res.render("output", {
    out: "{ " + out + " } ",
    title: "All Pair Shortest Path",
    tc: tcallpair
  });
});



//error get request
app.get("/error", function(req, res) {
  res.render("error", {
    error: errormessage
  });
});

//post request of all functions
app.post("/knapsack", function(req, res) {
  let size = req.body.size;
  let capacity = req.body.cap;
  let weight = [];
  let value = [];
  let textweight = req.body.weights;
  let textvalue = req.body.values;
  let j = 0;
  let cnt = 0;
  while (j < textweight.length) {
   
    let wadd = 0;
    while (textweight[j] !== " " && j !== textweight.length) {
      if (parseInt(textweight[j]) < 0 || parseInt(textweight[j]) > 9) {
        errormessage = "knapsack";
        res.redirect("/error");
      }
      wadd = wadd * 10 + parseInt(textweight[j]);
     
      j++;
    }
    weight.push(wadd);
    cnt++;
    if (j < textweight.length) {
      j++;
    } else {
      break;
    }
  }
  if (cnt !== parseInt(size)) {
    errormessage = "knapsack";
    res.redirect("/error");
  }
  j = 0;
  cnt = 0;
  while (j < textvalue.length) {
   
    let vadd = 0;
    while (textvalue[j] !== " " && j !== textvalue.length) {
      if (parseInt(textvalue[j]) < 0 || parseInt(textvalue[j]) > 9) {
        errormessage = "knapsack";
        res.redirect("/error");
      }
      vadd = vadd * 10 + parseInt(textvalue[j]);
    
      j++;
    }
    value.push(vadd);
    cnt++;
    if (j < textvalue.length) {
      j++;

    } else {
      break;
    }
  }

  if (cnt !== parseInt(size)) {
    errormessage = "knapsack";
    res.redirect("/error");
  }
  out = knapsackprob(weight, value, capacity, size);
  res.redirect("/outputknap");
});


app.post("/longest", function(req, res) {
  let size = req.body.size;
  let text = req.body.array;
  let longarray = [];
  let j = 0;
  let cnt = 0;
  while (j < text.length) {
  
    let wadd = 0;
    while (text[j] !== " " && j !== text.length) {
      if (parseInt(text[j]) < 0 || parseInt(text[j]) > 9) {
        errormessage = "longest";
        res.redirect("/error");
      }
      wadd = wadd * 10 + parseInt(text[j]);
    
      j++;
    }
    longarray.push(wadd);
    cnt++;
    if (j < text.length) {
      j++;
    } else {
      break;
    }
  }
  if (cnt === parseInt(size)) {
    out = longinc(size, longarray);
    res.redirect("/outputlong");
  } else {
    errormessage = "longest";
    res.redirect("/error");
  }

});

app.post("/printLCS",function(req,res){
  let a=req.body.str1;
  let b=req.body.str2;
  if(a.length===0 && b.length===0){
    errormessage="lcs";
    res.redirect("/error");
  }
  else{
    out=printLCS(a,b);
    res.redirect("/outputlcs");
  }
})

app.post("/allpair", function(req, res) {
  let size = req.body.size;
  let text = req.body.array;
  let longarray = new Array(parseInt(size));
  for (let i = 0; i < parseInt(size); i++) {
    longarray[i] = new Array(parseInt(size));
  }
  let j = 0;
  let cnt = 0;
  let ii = 0,
    jj = -1;
    if(text.length===0||size===0||size===""){
    errormessage = "allpair";
    res.redirect("/error");
    }
  while (j < text.length) {
   
    let wadd = 0;
    while (text[j] !== " " && j !== text.length) {
      if (text[j] === "^") {
        wadd = 9999;
        j++;
      } else if (parseInt(text[j]) < 0 || parseInt(text[j]) > 9) {
        errormessage = "allpair";
        res.redirect("/error");
      } else {
        wadd = wadd *10 + parseInt(text[j]);
      
        j++;
      }
    }

    if (jj < parseInt(size - 1)) {
      jj++;
    } else {
      ii++;
      jj = 0;
    }
    longarray[ii][jj] = wadd;
    if (j < text.length) {
      j++;
    } else {
      break;
    }
  }

  out = allpairproblem(size, longarray);
  res.redirect("/outputallpair");

});


// 

app.listen(3000, function() {
  console.log("server started on port 3000");
});
