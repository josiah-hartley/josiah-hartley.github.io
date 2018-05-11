$(function() {
    var morseCodes = {
        A: [0,1],
        B: [1,0,0,0],
        C: [1,0,1,0],
        D: [1,0,0],
        E: [0],
        F: [0,0,1,0],
        G: [1,1,0],
        H: [0,0,0,0],
        I: [0,0],
        J: [0,1,1,1],
        K: [1,0,1],
        L: [0,1,0,0],
        M: [1,1],
        N: [1,0],
        O: [1,1,1],
        P: [0,1,1,0],
        Q: [1,1,0,1],
        R: [0,1,0],
        S: [0,0,0],
        T: [1],
        U: [0,0,1],
        V: [0,0,0,1],
        W: [0,1,1],
        X: [1,0,0,1],
        Y: [1,0,1,1],
        Z: [1,1,0,0],
        0: [1,1,1,1,1],
        1: [0,1,1,1,1],
        2: [0,0,1,1,1],
        3: [0,0,0,1,1],
        4: [0,0,0,0,1],
        5: [0,0,0,0,0],
        6: [1,0,0,0,0],
        7: [1,1,0,0,0],
        8: [1,1,1,0,0],
        9: [1,1,1,1,0],
        '.': [0,1,0,1,0,1],
        ',': [1,1,0,0,1,1],
        '?': [0,0,1,1,0,0],
        '!': [0,0,1,1,0],
        ':': [1,1,1,0,0,0],
        '"': [0,1,0,0,1,0],
        "'": [0,1,1,1,1,0],
        '=': [1,0,0,0,1],
        ';': [1,0,1,0,1],
        '/': [1,0,0,1,0],
        '+': [0,1,0,1,0],
        '-': [1,0,0,0,0,1],
        '@': [0,1,1,0,1,0],
        '(': [1,0,1,1,0,1],
        ')': [1,0,1,1,0,1]
    }
    
    var config = {
        morseKey: 32,
        dotDuration: 150 // threshold for dot vs dash, in milliseconds
    }
    var startTime;
    var endTime;
    var keyPressed = false;
    var markType; // dot or dash
    
    //var text = "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.";
    var text = "abcd?";
    var tempTextArray = text.split('');
    var textArray = [];
    for (var i=0; i<tempTextArray.length; i++) {
        if (morseCodes[tempTextArray[i].toUpperCase()] !== undefined) {
            textArray.push(tempTextArray[i]);
        }
    }
    //var textArray = text.split('');
    var currentPosition = 0;
    
    var previousChar;
    var currentChar;
    var nextChar;
    var previousCharMorse;
    var currentCharMorse;
    var nextCharMorse;
    
    var positionWithinChar = 0; // index of current dot or dash in current character
    var rightOrWrong = 1; // whether or not the current character is entered correctly
    var currMarksRightOrWrong = []; // which of the marks is entered correctly in the currect character
    var prevMarksRightOrWrong = []; // which of the marks is entered correctly in the previous character
    var answers = []; // 0 for wrong answer, 1 for right answer
    
    var marks = {
        0: "<svg width='20' height='20'><circle cx='10' cy='10' r='5' class='dot'></circle></svg>",
        1: "<svg width='30' height='20'><line x1='5' y1='10' x2='25' y2='10' class='dash' /></svg>"
    }
    
    $(document).keydown(function(e) {
        if (e.which === config.morseKey && !keyPressed) {
            e.preventDefault();
            //startTime = performance.now();
            startTime = new Date().getTime();
            keyPressed = true;
        }
    });
    
    $(document).keyup(function(e) {
        if (e.which === config.morseKey) {
            keyPressed = false;
            //endTime = performance.now();
            endTime = new Date().getTime();
            
            if (endTime - startTime < config.dotDuration) {
                markType = 0;
                //console.log("dot");
            } else {
                markType = 1;
                //console.log("dash");
            }
            
            checkMark(markType);
        }
    });
    
    $("#clicker").longpress(function() {
        alert("longpressed");
    })
    
    $("#clicker").longpress(function() {
        alert("shortpressed");
    })
    
    showChars(currentPosition);
    
    function showChars(currentPosition) {
        previousChar = (currentPosition > 0) ? textArray[currentPosition - 1] : null;
        if (previousChar !== null) {
            previousCharMorse = morseCodes[previousChar.toUpperCase()];
        } else {
            previousCharMorse = "";
        }
        
        currentChar = (currentPosition < textArray.length) ? textArray[currentPosition] : null;
        if (currentChar !== null) {
            currentCharMorse = morseCodes[currentChar.toUpperCase()];
        } else {
            currentCharMorse = "";
        }
        
        nextChar = (currentPosition < textArray.length - 1) ? textArray[currentPosition + 1] : null;
        if (nextChar !== null) {
            nextCharMorse = morseCodes[nextChar.toUpperCase()];
        } else {
            nextCharMorse = "";
        }
        
        $("#prevChar").html(previousChar);
        $("#currChar").html(currentChar);
        $("#nextChar").html(nextChar);
        
        $("#prevCharMorse").empty();
        for (var i=0; i<previousCharMorse.length; i++) {
            if (prevMarksRightOrWrong[i] === 1) {
                $("#prevCharMorse").append("<span class='correct-mark'>" + marks[previousCharMorse[i]] + "</span>");
            } else {
                $("#prevCharMorse").append("<span class='incorrect-mark'>" + marks[previousCharMorse[i]] + "</span>");
            }
            
        }
        $("#currCharMorse").empty();
        if (currentCharMorse !== "") {
            $("#currCharMorse").append("<span class='current-mark'>" + marks[currentCharMorse[0]] + "</span>");
        }
        for (var j=1; j<currentCharMorse.length; j++) {
            $("#currCharMorse").append("<span>" + marks[currentCharMorse[j]] + "</span>");
        }
        $("#nextCharMorse").empty();
        for (var k=0; k<nextCharMorse.length; k++) {
            $("#nextCharMorse").append("<span>" + marks[nextCharMorse[k]] + "</span>");
        }
        //$("#prevCharMorse").html(previousCharMorse);
        //$("#currCharMorse").html(currentCharMorse);
        //$("#nextCharMorse").html(nextCharMorse);
        
        //console.log("morse", currentCharMorse);
    }
    
    function moveToNextChar() {
        if (currentPosition < textArray.length) {
            currentPosition += 1;
            
            prevMarksRightOrWrong = currMarksRightOrWrong;
            currMarksRightOrWrong = [];
            
            showChars(currentPosition);
            positionWithinChar = 0;
            
            answers.push(rightOrWrong);
            //console.log("answers", answers);
            
            //console.log("prevAnswer", answers, answers[currentPosition - 1]);
            if (answers[currentPosition - 1] === 1) {
                $("#prevChar").addClass("correct-char");
            } else {
                $("#prevChar").removeClass("correct-char");
                $("#prevChar").addClass("incorrect-char");
            }

            rightOrWrong = 1;
        } 
        
        if (currentPosition === textArray.length) {
            openResultsModal();
            //console.log("results", answers);
        }
    }
    
    function checkMark(type) {
        // type: 0 for dot, 1 for dash
        
        /*console.log("currentChar: ", currentChar);
        console.log("currentCharMorse: ", currentCharMorse);
        console.log("positionWithinChar: ", positionWithinChar);
        console.log("type: ", type);
        console.log("should be: ", currentCharMorse[positionWithinChar]);*/
        
        if (currentPosition === textArray.length) {
            return false;
        }
        
        if (type === currentCharMorse[positionWithinChar]) {
            currMarksRightOrWrong.push(1);
            //console.log("correct");
        } else {
            currMarksRightOrWrong.push(0);
            rightOrWrong = 0;
            //console.log("incorrect");
        }
        
        if (positionWithinChar < currentCharMorse.length - 1) {
            moveToNextPosition();
        } else {
            moveToNextChar();
        }
    }
    
    function moveToNextPosition() {
        if (currMarksRightOrWrong[positionWithinChar] === 1) {
            $("#currCharMorse > span:nth-child(" + (positionWithinChar + 1) + ")").addClass("correct-mark");
        } else {
            $("#currCharMorse > span:nth-child(" + (positionWithinChar + 1) + ")").addClass("incorrect-mark");
        }
        positionWithinChar += 1;
        
        $("#currCharMorse > span").removeClass("current-mark");
        $("#currCharMorse > span:nth-child(" + (positionWithinChar + 1) + ")").addClass("current-mark");
    }
    
    function getSum(total, num) {
        return total + num;
    }
    function sumArray(arr) {
        return arr.reduce(getSum);
    }
    
    function openResultsModal() {
        var correct = sumArray(answers);
        var total = answers.length;
        var percentage = (100 * correct / total).toFixed(1);
        $(".results-holder").append("<p>Congrats, you got " + correct + " correct, out of " + total + "!  That means you were " + percentage + "% perfect!</p>");
        $(".results-modal").removeClass("hidden");
    }
    
    function closeResultsModal() {
        $(".results-modal").addClass("hidden");
        $(".results-holder").empty();
    }
    
    function restart() {
        currentPosition = 0;
        positionWithinChar = 0;
        rightOrWrong = 1;
        currMarksRightOrWrong = [];
        prevMarksRightOrWrong = [];
        answers = [];
        
        showChars(currentPosition);
    }
    
    $("#close-results-modal").on('click', function() {
        closeResultsModal();
        restart();
    })
    
    $("#tick").on('click', function() {
        moveToNextChar();
    })
})
