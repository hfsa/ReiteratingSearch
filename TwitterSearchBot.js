


var searchHistory = {
    terms: []
};


function addtoHistory(searchword, source){

    searchHistory.terms.push({ 
        "searchword" : searchword,
        "source"  : source,
    });

}

/////////

var stop = false;

var start=true;

/////////////////////////////////////////////////

function EnterSearchTerm() {

	console.log("EnterSearchTerm");


//display search dialogue for user input

if (start) {
	var disp=document.getElementById("results_display");
	var div = document.createElement("div");
	div.id="div0";
	div.innerHTML = "Instructions:"+"<br>"+"<br>"
	+"Enter a search term to get started."+"<br>"+"<br>"
	+"Tweets containing your search term will be shown in this box here."+"<br>"+"<br>"
	+"TwitterSearchBot will generate a new search, by randomly selecting one of the most common terms appearing in the search results."+"<br>"+"<br>"
	+"TwitterSearchBot will continue to generate new searches based on previous search results."+"<br>"+"<br>"
	+"A search history will be displayed on the column to your left."+"<br>"+"<br>"
	+"Press the ’stop’ button if you want to enter a new word to search."+"<br>"+"<br>"
	+"Words that you enter into the search box will be highlighted in red in the search history column on the left."+"<br>"+"<br>"
	+"You can hit the ‘pause’ button to pause the program if you want to read through the tweets without interrupting the search flow."+"<br>"+"<br>"
	+"Have fun and enjoy the random tangents";
	disp.appendChild(div);
	start=false;
}

//about button attibute
var about = document.getElementById("About");
	about.onmouseenter=function(){about.style.color ='#990000'};
	about.onmouseleave=function(){about.style.color = "black"};



//add attributes to search box
    var input = document.getElementById("term");
	input.onkeypress=function(){if (event.keyCode===13) { search(); }};


//search button attributes
	var button = document.getElementById("search_button");
	button.addEventListener("click", search);


//  display button attributes

	var button = document.getElementById("Restart");
	//button.innerHTML = "STOP" + "<br>"+ "Enter new term.";
	button.addEventListener("click", refresh);

	var button = document.getElementById("Pause");
	img = document.getElementById("pausebutton");
	img.src = "play.png";
	button.addEventListener("click", search);


}

///////////////////////////////////////////////////////

function search () {

console.log("search");

//disable search button and change color
var button = document.getElementById("search_button");
button.removeEventListener("click", search);
//button.style.backgroundColor="#0066ff";

//change play button to pause button
	var button = document.getElementById("Pause");
	img = document.getElementById("pausebutton");
	img.src = "pause.png";
	button.removeEventListener("click", search);
	button.addEventListener("click", Pause);

stop = false;

//get search term
	var input =document.getElementById("term");
    var x = input.value;

///disable enter key
	input.onkeypress=function(){};


//save search term to search history
	addtoHistory(x, "user");

//add padding to match whole words only
    x = " " + x + " ";

//load the data
	d3.json("tweets.json", function(data) {

//search for term within data
	var results = [];
	for (var i=0; i<data.length; i++){

		var n = data[i].text.toLowerCase().search(x.toLowerCase());
		if (n!=-1){
			results.push(data[i].text);
		}

	}

	if (results.length>1){
//call display function 
		display(results);

	}

	else{
		display(x + ": sorry no matches.  Please try another word.")
	}


	});




}


/////////////////////////////////////////////////////

function display(results) {

console.log("display");



//remove previous display
	RemoveDisplay();

//reset button color
var button = document.getElementById("search_button");
button.style.backgroundColor="white";



//show results 
//    var div =document.getElementById("show");
 //   div.style.display="block";




// display search history
	var sidebar = document.getElementById("left_column");

	//var searchHistoryList = searchHistory.terms.searchword;

	var len = searchHistory.terms.length;


//display search history header
	var list = document.createElement("div");
	list.id="list"+len.toString();
	list.style.marginBottom = "10px";
	list.style.fontSize="18px";
	list.style.color='#4d75b3';
	list.innerHTML = "Search History";
	sidebar.appendChild(list);


//display search history
	for (var i=len-1; i>=0; i--){
	var list = document.createElement("div");
	list.id="list"+i.toString();
	list.style.marginBottom = "10px";
	var term = searchHistory.terms[i].searchword;
	var source = searchHistory.terms[i].source;

	if (searchHistory.terms[i].source=="user"){
		list.style.color ='#990000';

	}
	else{
		list.style.color= "black";
	}

	list.innerHTML= term;
	sidebar.appendChild(list);
   }




// display results
	var disp = document.getElementById("results_display")

if (Array.isArray(results)){

	// shuffle results array
	results = shuffle(results);


	 //limit number of results to show on screen
	if (results.length>100){
		var maxResults = 100;
	}
	else {
		maxResults = results.length;
	}

	//display title
	var div = document.createElement("div");
	div.style.marginBottom = "10px";
	div.id="div0";
	div.style.fontSize="20px";
	div.style.color="#4d75b3";
	div.innerHTML = "Tweets containing '" + searchHistory.terms[len-1].searchword + "'" ;
	disp.appendChild(div);


	//display search results one line at a time
	for (var i = 1; i < maxResults; i++){

			var div = document.createElement("div");	
			div.style.marginBottom = "20px";
			div.id="div"+i.toString();
			div.innerHTML = results[i];
			disp.appendChild(div);

	}

	//call function to generate new search term after 3 second delay
	setTimeout(function(){newterm(results);},6000);

}

// or display error message if no results
else {
	var div = document.createElement("div");
	div.id="div0";
	div.innerHTML = results;
	disp.appendChild(div);

//  call EnterSearchTerm function
EnterSearchTerm()
}



}

//////////////////////////////////////////////////

function refresh(){

	console.log("refresh");

//reset button color
var button = document.getElementById("search_button");
button.style.backgroundColor="white";


	stop = true;

//remove results display & Hide buttons
   // var div =document.getElementById("show");
	//div.style.display="none";

	//RemoveDisplay();
    



//change pause button to play button (here we remove the event listener. rest is done in EnterSearchTerm)
	var button = document.getElementById("Pause");
	button.removeEventListener("click", Pause);


//restart
	EnterSearchTerm();
}


////////////////////////////////////////////////////

function newterm(results){

	console.log("newterm");

//reset search button color
var button = document.getElementById("search_button");
button.style.backgroundColor="white";


//do the wordcount; store in object words
var words = function(){

//step 1: make a wordbag, make lowercase remove delimiters
var wordbag = " ";
for (var i = 0; i<results.length; i++){

//make it lowercase, remove delimiters, split into words: create word list from results
wordbag = wordbag + results[i].toLowerCase().replace(/[-,;?!.'"]/g,'') + " ";
	}

//step 2: create word array
var sWords = wordbag.split(/[\s\/]+/g);
var iWordsCount = sWords.length; // count w/ duplicates

//and this is the array of words to ignore
	var ignore = ['he','you','your','me','my','im','and','the','to','a','of','for','as','i','with','it','is','on','that','this','can','in','be','has','if', 'an', '&amp', '', 'its'];
	ignore = (function(){
		var o = {}; // object prop checking > in array checking
		var iCount = ignore.length;
		for (var i=0;i<iCount;i++){
			o[ignore[i]] = true;
		}
		return o;
	}());

//step 3: do the counting
	var counts = {}; // object for math
	for (var i=0; i<iWordsCount; i++) {
		var sWord = sWords[i];
		if (!ignore[sWord]) {
			counts[sWord] = counts[sWord] || 0;
			counts[sWord]++;
		}
	}

//step 4 create array of objects to return
	var arr = []; // an array of objects to return
	for (sWord in counts) {
		arr.push({
			text: sWord,
			frequency: counts[sWord]
		});
	}

	// sort array by descending frequency | http://stackoverflow.com/a/8837505
	return arr.sort(function(a,b){
		return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
	});

}();



//select a word randomly from the top five most frequent.  This is the new search term
var max = 5;
var min = 1;

var index =	function getRandomInt() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}();

var newsearchterm = words[index].text;

// change input display 
document.getElementById("term").value = newsearchterm;


//call new search function after 1 second

setTimeout(function(){searchagain(newsearchterm);},600);
}



///////////////////////////////////////////////////////

function searchagain(x){

console.log("searchagain");

if (!stop){


//change search button color
document.getElementById("search_button").style.backgroundColor='#4d75b3';


//save search term to search history
addtoHistory(x, "auto");




//load the data
	d3.json("tweets.json", function(data) {

//search for term within data
	var results = [];
	for (var i=0; i<data.length; i++){

		var n = data[i].text.toLowerCase().search(x.toLowerCase());
		if (n!=-1){
			results.push(data[i].text);
		}

	}

	if (results.length>3){

//call display function to display new results
	display(results);

	}

	else{
//display error message
		display(x + ": not enough data.  Give me another word")
	}


	});
}

}


/////////////////////////////////////////////////////
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
/////////////////////////////////////////////

function RemoveDisplay(){
    
console.log("RemoveDisplay");

//remove tweets
    var disp= document.getElementById("results_display");
    var child=disp.childNodes;
    var len = child.length;


    for (var i=0; i<len-1; i++){
   	 var div = document.getElementById("div"+i.toString());
	 disp.removeChild(div);
    }

//remove search history
    var sidebar= document.getElementById("left_column");
    var child=sidebar.childNodes;
    var len = child.length;


    for (var i=0; i<len-1; i++){
   	 var list = document.getElementById("list"+i.toString());
	 sidebar.removeChild(list);
    }


}

/////////////////////////////////////////////////////

function Pause(){
	
	console.log("pause");

if (stop===false){

	stop = true;

	//replace pause button image
	var img = document.getElementById("pausebutton");
	img.src = "play.png";

}
else {


	var img = document.getElementById("pausebutton");
	img.src = "pause.png";

	stop =false;

	//call search function
	var len = searchHistory.terms.length;
	var current_term = searchHistory.terms[len-1].searchword;
	searchagain(current_term);

}

}

//////////////////////////////////////////////////////////

function About(){
	stop = true;
	RemoveDisplay();
	ShowMenu();

   //////////////////////////////
	function ShowMenu(){

	var sidebar = document.getElementById("left_column")
	
	///display list of options
	var list0 = document.createElement("div");
	list0.id="list0";
	list0.style.marginBottom = "10px";
	list0.style.fontSize="18px";
	list0.innerHTML = "About this work";
	sidebar.appendChild(list0);

	var list1 = document.createElement("div");
	list1.id="list1";
	list1.style.marginBottom = "10px";
	list1.style.marginLeft = "10px";
	list1.innerHTML = "Description";
	list1.onmouseenter=function(){list1.style.color ='#990000'};
	list1.onmouseleave=function(){list1.style.color ='black'};
	list1.onclick = Description;
	sidebar.appendChild(list1);

	var list2 = document.createElement("div");
	list2.id="list2";
	list2.style.marginBottom = "10px";
	list2.style.marginLeft = "10px";
	list2.innerHTML = "Statement";
	list2.onmouseenter=function(){list2.style.color ='#990000'};
	list2.onmouseleave=function(){list2.style.color ='black'};
	list2.onclick = ArtStatement;
	sidebar.appendChild(list2);

	var list3 = document.createElement("div");
	list3.id="list3";
	list3.style.marginBottom = "10px";
	list3.style.marginLeft = "10px";
	list3.innerHTML = "Technical Details";
	list3.onmouseenter=function(){list3.style.color ='#990000'};
	list3.onmouseleave=function(){list3.style.color ='black'};
	list3.onclick = Technical;
	sidebar.appendChild(list3);


	var list4 = document.createElement("div");
	list4.id="list4";
	list4.style.marginBottom = "10px";
	list1.style.marginLeft = "10px";
	list4.style.fontSize="18px";
	list4.innerHTML = "About me";
	list4.onmouseenter=function(){list4.style.color ='#990000'};
	list4.onmouseleave=function(){list4.style.color ='black'};
	list4.onclick = Aboutme;
	sidebar.appendChild(list4);
	}
////////////////////////////////////////

	function Aboutme(){

	RemoveDisplay();

	ShowMenu();

	var list4 = document.getElementById("list4");
	list4.onmouseleave=function(){list4.style.color ='#990000'};


	var disp= document.getElementById("results_display");
	var div = document.createElement("div");
	div.style.marginBottom = "10px";
	div.id="div0";
	div.innerHTML = "I am an artist and a researcher with a very broad range of interests.  "
	+"I started academic life as a physicist with a PhD from the University of Toronto; I worked at NIST, and taught at UNC Charlotte before I decided to become " 
	+ "a vagabond".strike() +  " an artist, and went back to school to complete an MFA at OCAD University back in Toronto. I am currently still at OCAD U working as a research fellow in the " 
	+ "Visual Analytics Lab".link("http://research.ocadu.ca/val/home") 
	+".  My list of creative and research interests includes figurative sculpture, the uncanny, puppetry, robotics, tangible interface design, data visualization, and public pedagogy. "
	+"I have a penchant for the absurd; I make ridiculous art because I believe the world is ridiculous."
	+"<br>"+"<br>"
	+ "Ana Jofre".link("http://onewomancaravan.net");
	disp.appendChild(div);

	}

	//////////////////////////////

	function Description(){

	RemoveDisplay();

	ShowMenu();
		
	var list = document.getElementById("list1");
	list.onmouseleave=function(){list.style.color ='#990000'};


	var disp= document.getElementById("results_display");
	var div = document.createElement("div");
	div.style.marginBottom = "10px";
	div.id="div0";
	div.innerHTML = "Enter a search term, see the results, then watch TwitterSearchBot take over.  TwitterSearchBot finds the most common terms within your search results, chooses one randomly from the top ten, then generates a new search. It continues to iterate this procedure, displaying results and generating new searches until the user interrupts (with the stop button) to enter a new word. A sidebar keeps track of the search history, so that viewers can track the extent to which the searches were related to one another.";
	disp.appendChild(div);

	}

////////////////////////////////

	function ArtStatement(){

	RemoveDisplay();

	ShowMenu();
		
	var list = document.getElementById("list2");
	list.onmouseleave=function(){list.style.color ='#990000'};


	var disp= document.getElementById("results_display");
	var div = document.createElement("div");
	div.style.marginBottom = "10px";
	div.id="div0";
	div.innerHTML = "This work is intended to simulate important facets of the experience of linking through articles online —sometimes one will end up in a very unrelated place after a few iterations, whereas other searches take us into more detail on our original topic. The work interrogates our intuitions about the internet’s connection to distractibility, short attention spans, roving curiosity, and even the open-minded receptivity to new information.  It exposes the heterogeneity in tweeting behavior, but also its homogeneity as some topics and tweets repeat themselves.  The work also speaks to the rapidity of the evolution of information, by allowing viewers to witness the evolution of tweet topics over time.";
	disp.appendChild(div);
	}

//////////////////////////////////

	function Technical(){

	RemoveDisplay();

	ShowMenu();
		
	var list = document.getElementById("list3");
	list.onmouseleave=function(){list.style.color ='#990000'};


	var disp= document.getElementById("results_display");
	var div = document.createElement("div");
	div.style.marginBottom = "10px";
	div.id="div0";
	div.innerHTML = "This work runs in two parts:"+ "<br>" +"<br>"
	+ "1) The backend runs a "+ "Python".link("https://www.python.org/")+" script, which uses "
	+"Tweepy".link("http://www.tweepy.org/)")+" to collect tweets and save them to a file (I used snippets of code from "
	+"here".link("https://github.com/computermacgyver/twitter-python") +"). "
	+" I update the file every 15 minutes – adding new tweets and deleting old tweets.  The file contains as many tweets as I can collect (given rate limits and filters and all) over about 3 hours – about 20MB of tweet texts only."
	+"<br>"+"<br>"
	+ "2) The frontend is just Javascript with a little D3.  It runs a search on the file containing tweets from the past 3 hours, displays the results, and determines new search terms.";
	disp.appendChild(div);
	}
	

////////////////////////////

}

