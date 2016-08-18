import { quiz } from './quiz'

var $ = require('jquery')
const jQuery = require('jquery');
console.log("fasdsafdsfsd");
global.jQuery = jQuery;
global.$ = jQuery;


 $( document ).ready(function() {


var quizdescription = '<h3>Väripelissä ruutuun ilmesty erivärisiä sanoja. Tehtävänäsi on kertoa, minkä <strong>värinen</strong> näkemäsi sana on. </h3>';
var quizinstructions = '<p>Vastaamiseen on aikaraja, ja vauhti kiihtyy pelin edetessä. Miten pitkälle sinä pääset?</p>';
var articlead = '<p>Lue myös: <a href="../mulla-on-peli-kesken"><strong>Mulla on peli kesken - Pelaaminen kehittää kognitiivisia taitoja</strong></a></p>';


// Todo: Toisesta pitää päästä eroon 
let alphabetOrig = 'abcdefghijklmnopqrstuvwxyz'.split('');
let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Shuffle quiz array 
function shuffle (array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  let array2 = array

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array2[currentIndex];
    array2[currentIndex] = array2[randomIndex];
    array2[randomIndex] = temporaryValue;
  }

  return array2;
}
// TODO: miksi shuffle ylikirjoittaa alphabetin?
let alphabetShuffled = shuffle(alphabet);

/* quiz settings */

var currentquestion = 0,
score = 0,
submt = true,
timeLimit = 4000,
picked;


var timer;
function endAndStartTimer() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function(){
        currentquestion++;
        if (currentquestion == quiz.length) {
            endQuiz();
        } else {
            nextQuestion(); 
        }
    },timeLimit); 
}

function htmlEncode(value) {
    return $(document.createElement('div')).text(value).html();
}

function nextQuestion(choice) {
   console.log("alphabet=")
    if (!choice) {
        window.clearTimeout(timer);
        endQuiz();
        return;
    }
    submt = true;
    $('#question').text('Minkä värinen teksti on?');
    $('#pager').text('vaihe ' + Number(currentquestion));
    if (alphabetShuffled[currentquestion] != "") {
    if ($('#question-word').length == 0) {
    $('#question-word')
    	.addClass('question-word')
    	.removeClass(quiz[currentquestion-1]['color'])
    	.addClass(quiz[currentquestion]['color'])
    	.attr('id', 'question-word')
    	.html(alphabetShuffled[currentquestion])
    	.insertAfter('#question');
    } else {
    $('#question-word')
	    .addClass('question-word')
	    .removeClass(quiz[currentquestion-1]['color'])
	    .addClass(quiz[currentquestion]['color'])
	    .attr('id', 'question-word').html(alphabetShuffled[currentquestion]);
    }
    } else {
    $('#question-word').remove();
    }

    timeLimit = timeLimit - (timeLimit*0.03);
    endAndStartTimer(timeLimit);

    let newArray = alphabetShuffled.slice(currentquestion, currentquestion + 4)
    console.log("Tämä" + newArray)
    let newArray2 = shuffle(newArray);

    addChoices(newArray2);

    addChoices(alphabetShuffled[currentquestion]);
    setupButtons();
}
 
function endQuiz() {
    $('.pager').empty();
    $('#question').empty();
    $('#choice-block').remove();  
    $('.question-word').remove();
    $('.timer-bar-container').remove();
    $('#share-article').show();
    $('#read-also').show().insertAfter('#share-article');
    $('.pager').text("Peli päättyi");
    $(document.createElement('h2')).addClass('end-title').attr('id', 'end-title').text('Sait pelistä ' + score + ' pistettä!').insertAfter('#question');  

    var endMessage;
    if (score < 3) { 
        endMessage = 'Työmuistisi saattaa olla täynnä. Kokeile uudestaan?';
        shareText = 'Sain ' + score + ' oikein Väritestissä. Olisi ehkä syytä tyhjentää työmuisti?';
    }
    else if (score >= 3 && score < 6) { 
        endMessage = 'Keskittymisessä on vielä parannettavaa. Tee testi toistamiseen?'; 
        shareText = 'Sain ' + score + ' oikein Väritestissä. Keskittymisessä on vielä parannettavaa.';
    }
    else if (score >= 6 && score < 9) { 
        endMessage = 'Aivosi hyödyntävät resursseja tehokkaasti.'; 
        shareText = 'Sain ' + score + ' oikein Väritestissä. Aivoresurssit ovat tehokkaassa käytössä!';
    }
    else if (score >= 9 && score < 12) { 
        endMessage = 'Hienosti meni! Hermosolusi värähtelevät tehokkaasti.'; 
        shareText = 'Sain ' + score + ' oikein Väritestissä. Hermosolut värähtelevät kiitettävästi!';
    }
    else if (score >= 12) { 
        endMessage = 'Aivokuoresi sisäiset yhteydet pelaavat ja aivosi käsittelevät tietoa erittäin tarkasti.'; 
        shareText = 'Sain ' + score + ' oikein Väritestissä. Aivokuoren sisäiset yhteydet pelaavat!';
    };

    $(document.createElement('h4')).addClass('result-text').html(endMessage).appendTo('#frame');
    $(document.createElement('p')).attr('id', 'quiz-restart').appendTo('#frame');
    $(document.createElement('a')).attr('id', 'quiz-start').addClass('btn btn-outlined').attr('title', 'Aloita peli uudestaan').attr('href', 'javascript: location.reload();').html('Pelaa uudestaan').appendTo('#quiz-restart');
    $('#share-facebook').html('<a title="Jaa Facebookiin" href="https://www.facebook.com/dialog/feed?app_id=1397564560570485&link=http://yle.fi/teos/ihmeellisetaivot/varipeli&picture=http://yle.fi/teos/ihmeellisetaivot/img/share/varipeli.jpg&name=' + shareText + '&caption=Ihmeelliset%20Aivot&description=Toimintapelien pelaaminen parantaa huomiokykyä. Keskimäärin pelaajat pärjäävät väritestissä paremmin kuin muut. Kokeile miten itse pärjäät testissä!&redirect_uri=http://yle.fi/teos/ihmeellisetaivot/varipeli&display=popup"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-facebook fa-stack-1x fa-inverse"></i></span><p class="georgia">Facebookissa</p></a>');
    $('#share-twitter').html('<a title="Jaa Twitteriin" href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fyle.fi%2Fihmeellisetaivot%2Fvaripeli&text=' + shareText + ' Testaa omat hoksottimesi&hashtags=ihmeaivot"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-twitter fa-stack-1x fa-inverse"></i></span><p class="georgia">Twitterissä</p></a>');
}


function addChoices(choices) {
    if (typeof choices !== "undefined" && $.type(choices) == "array") {
        $('#choice-block').empty();
        for (var i = 0; i < 4; i++) {
            $(document.createElement('li')).addClass('btn btn-outlined choice choice-box').attr('data-index', choices[i]).text(choices[i]).appendTo('#choice-block');
        };
    }
}


function processQuestion(choice) {
	console.log(nextLetter + choice)
    if (nextLetter != choice) {
    window.clearTimeout(timer);
     endQuiz();
    } else if (nextLetter === choice) {
        score++;
        currentquestion++;
        nextQuestion(choice);
    } else {
        window.clearTimeout(timer);
        endQuiz();
    }

    if (currentquestion == quiz.length) {
        endQuiz();
    } 
}


function setupButtons() {
    if(currentquestion >= 1 ) {
        $('#timer-bar-container'+(currentquestion-1)).remove();
    }
    $(document.createElement('div')).addClass('timer-bar-container').attr('id', 'timer-bar-container'+currentquestion).appendTo('#frame');
    $(document.createElement('div')).addClass('timer-bar').attr('id', 'timer-bar'+currentquestion).appendTo('#timer-bar-container'+currentquestion);
    timeLimit = timeLimit - 150;
    $('#timer-bar'+currentquestion).animate({width:'0px'}, timeLimit, 'linear');

    $('.choice').on('click', function () {
        picked = $(this).attr('data-index');
        console.log("tämä valittiin " + picked)

        submt = false;
        $('.choice').off('click');
             $(this).off('click');
             processQuestion(picked);

        if (submt) {
         submt = false;
         $('#submitbutton').css({
             'color': '#000'
         }).on('click', function () {
             $('.choice').off('click');
             $(this).off('click');
             processQuestion(picked);
         });
        }
    })
}

let nextLetter;

function init() {
    $('#start-test').remove();
    $('.description').remove();
    $('#read-also').hide();

    //add pager and questions
    if (typeof quiz !== "undefined" && $.type(quiz) === "array") {
    //add pager
    $(document.createElement('p')).addClass('pager').attr('id', 'pager').text('vaihe 1').appendTo('#frame');
    //add first question
    $(document.createElement('h2')).addClass('question').attr('id', 'question').text('Minkä värinen teksti on?').appendTo('#frame');

    //add image if present
    if (quiz[0].hasOwnProperty('word') && quiz[0]['word'] != "") {
        $(document.createElement('span')).addClass('question-word').addClass(alphabetShuffled[0]['color']).attr('id', 'question-word').html(alphabetShuffled[0]).appendTo('#frame');
    }

    //questions holder
    $(document.createElement('ul')).attr('id', 'choice-block').appendTo('#frame');

    //add choices

    nextLetter = alphabetOrig[alphabetOrig.indexOf(alphabetShuffled[0]) + 1]

    let newArray = alphabetShuffled.slice(0,3)

    newArray.push(nextLetter)

    let newArray2 = shuffle(newArray);
    
    addChoices(newArray2);

    endAndStartTimer();

    setupButtons();

    }
}

//add description etc.
$(document.createElement('div')).addClass('description').html(quizdescription).appendTo('#frame');
$(document.createElement('div')).addClass('description').html(quizinstructions).appendTo('#frame');
$(document.createElement('div')).addClass('start-test').attr('id', 'start-test').appendTo('#frame');
$(document.createElement('a'))
	.addClass('btn btn-outlined')
	.attr('id', 'quiz-start')
	.attr('title', 'Aloita peli')
	.html('<span class="moi">Aloita!</span>')
	.appendTo('#start-test')
	.click(function() { init(); }); 

 });
