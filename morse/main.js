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
    
    var text = "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.";
    //var text = "abcd?";
    
    var texts = {
        alphabet: {
            title: 'Alphabet',
            line: 'abcdefghijklmnopqrstuvwxyz0123456789.,?!:"\'=;/+-@()'
        },
        PnP: {
            title: 'Pride and Prejudice',
            line: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife."
        },
        ToTC: {
            title: 'Tale of Two Cities',
            line: "It was the best of times,\
            it was the worst of times,\
            it was the age of wisdom,\
            it was the age of foolishness,\
            it was the epoch of belief,\
            it was the epoch of incredulity,\
            it was the season of Light,\
            it was the season of Darkness,\
            it was the spring of hope,\
            it was the winter of despair,\
            we had everything before us,\
            we had nothing before us,\
            we were all going direct to Heaven,\
            we were all going direct the other way--\
            in short, the period was so far like the present period, that some of\
            its noisiest authorities insisted on its being received, for good or for\
            evil, in the superlative degree of comparison only."
        },
        MD: {
            title: 'Moby Dick',
            line: 'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.'
        },
        AiW: {
            title: 'Alice in Wonderland',
            line: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, ‘and what is the use of a book,’ thought Alice ‘without pictures or conversations?’"
        },
        iliad: {
            title: 'The Iliad',
            line: 'In the war of Troy, the Greeks having sacked some of the neighbouring towns, and taken from thence two beautiful captives, Chryseis and Briseis, allotted the first to Agamemnon, and the last to Achilles. Chryses, the father of Chryseis, and priest of Apollo, comes to the Grecian camp to ransom her; with which the action of the poem opens, in the tenth year of the siege.'
        },
        GE: {
            title: 'Great Expectations',
            line: 'My father\'s family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip. So, I called myself Pip, and came to be called Pip.'
        },
        dg: {
            title: 'The Picture of Dorian Gray',
            line: 'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.'
        },
        bk: {
            title: 'The Brothers Karamazov',
            line: 'Alexey Fyodorovitch Karamazov was the third son of Fyodor Pavlovitch Karamazov, a land owner well known in our district in his own day, and still remembered among us owing to his gloomy and tragic death, which happened thirteen years ago, and which I shall describe in its proper place.'
        },
        mp: {
            title: 'A Modest Proposal',
            line: 'It is a melancholy object to those, who walk through this great town, or travel in the country, when they see the streets, the roads and cabbin-doors crowded with beggars of the female sex, followed by three, four, or six children, all in rags, and importuning every passenger for an alms.'
        },
        ti: {
            title: 'Treasure Island',
            line: 'Squire Trelawney, Dr. Livesey, and the rest of these gentlemen having asked me to write down the whole particulars about Treasure Island, from the beginning to the end, keeping nothing back but the bearings of the island, and that only because there is still treasure not yet lifted, I take up my pen in the year of grace 17__ and go back to the time when my father kept the Admiral Benbow inn and the brown old seaman with the sabre cut first took up his lodging under our roof.'
        },
        pp: {
            title: 'Peter Pan',
            line: 'All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this. One day when she was two years old she was playing in a garden, and she plucked another flower and ran with it to her mother. I suppose she must have looked rather delightful, for Mrs. Darling put her hand to her heart and cried, “Oh, why can\'t you remain like this for ever!” This was all that passed between them on the subject, but henceforth Wendy knew that she must grow up. You always know after you are two. Two is the beginning of the end.'
        },
        ww: {
            title: 'War of the Worlds',
            line: 'No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely by intelligences greater than man\'s and yet as mortal as his own; that as men busied themselves about their various concerns they were scrutinised and studied, perhaps almost as narrowly as a man with a microscope might scrutinise the transient creatures that swarm and multiply in a drop of water.'
        }
    }
    
    for (var key in texts) {
        $("#text-options").append("<option value='" + key + "'>" + texts[key].title + "</option>");
        //console.log("key", key);
    }
    
    function makeTextArray() {
        var tempTextArray = text.split('');
        var textArray = [];
        for (var i=0; i<tempTextArray.length; i++) {
            if (isMorse(tempTextArray[i])) {
                textArray.push(tempTextArray[i]);
            }
        }
        
        return textArray;
    }
    
    var textArray = makeTextArray();
    
    //var textArray = text.split('');
    var currentPosition = 0;
    
    var previousChar;
    var currentChar;
    var nextChar;
    var previousCharMorse;
    var currentCharMorse;
    var nextCharMorse;
    
    var disableSpacebar = true;
    
    var positionWithinChar = 0; // index of current dot or dash in current character
    var rightOrWrong = 1; // whether or not the current character is entered correctly
    var currMarksRightOrWrong = []; // which of the marks is entered correctly in the currect character
    var prevMarksRightOrWrong = []; // which of the marks is entered correctly in the previous character
    var answers = []; // 0 for wrong answer, 1 for right answer
    
    var pastText = "";
    var currentText = text[0];
    var futureText = text.slice(1);
    scanToNextValid();
    
    var marks = {
        0: "<svg width='20' height='20'><circle cx='10' cy='10' r='5' class='dot'></circle></svg>",
        1: "<svg width='30' height='20'><line x1='5' y1='10' x2='25' y2='10' class='dash' /></svg>"
    }
    
    function isMorse(c) {
        return (c !== undefined) ? morseCodes[c.toUpperCase()] !== undefined : false;
    }
    
    function scanToNextValid() {
        while (!isMorse(currentText) && futureText !== '') {
            pastText += currentText;
            currentText = futureText[0];
            futureText = futureText.slice(1);
        }
    }
    
    $(document).keydown(function(e) {
        if (e.which === config.morseKey && !keyPressed && disableSpacebar) {
            e.preventDefault();
            //startTime = performance.now();
            startTime = new Date().getTime();
            keyPressed = true;
        }
    });
    
    $(document).keyup(function(e) {
        if (e.which === config.morseKey && disableSpacebar) {
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
    
    /*$("#clicker").longpress(function() {
        markType = 1;
        checkMark(markType);
    }, function() {
        markType = 0;
        checkMark(markType);
    }, config.dotDuration);*/
    
    $("#clicker-dot").on('click', function() {
        markType = 0;
        checkMark(markType);
    });
    $("#clicker-dash").on('click', function() {
        markType = 1;
        checkMark(markType);
    });
    
    showChars(currentPosition);
    
    function showChars(currentPosition) {
        // Populate the full-text table
        $("#past-text").html(pastText);
        $("#current-text").html(currentText);
        $("#future-text").html(futureText);
        
        // Fill in the left-hand slot in the main window
        previousChar = (currentPosition > 0) ? textArray[currentPosition - 1] : null;
        if (previousChar !== null) {
            previousCharMorse = morseCodes[previousChar.toUpperCase()];
        } else {
            previousCharMorse = "";
        }
        
        // Fill in the middle (main) slot in the main window
        currentChar = (currentPosition < textArray.length) ? textArray[currentPosition] : null;
        if (currentChar !== null) {
            currentCharMorse = morseCodes[currentChar.toUpperCase()];
        } else {
            currentCharMorse = "";
        }
        
        // Fill in the right-hand slot in the main window
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
            
            pastText += currentText;
            currentText = futureText[0];
            futureText = futureText.slice(1);
            scanToNextValid();
            
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
            $("#current-text").empty();
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
        
        textArray = makeTextArray();
        
        pastText = "";
        currentText = text[0];
        futureText = text.slice(1);
        scanToNextValid();
        
        rightOrWrong = 1;
        currMarksRightOrWrong = [];
        prevMarksRightOrWrong = [];
        answers = [];
        
        showChars(currentPosition);
    }
    
    $("#show-mobile-controls").on('click', function() {
        $("#clicker").toggleClass('hidden-not-phone');
    })
    
    $("#settingsbtn").on('click', function() {
        $(".dropdown-content").toggleClass("dropdown-hidden");
    })
    
    $("#enter-new-text").on('click', function() {
        $("#text-selector").addClass("hidden");
        $("#new-text-box").removeClass("hidden");
        $("#new-text").focus();
        disableSpacebar = false;
    })
    
    /*$("#new-text-form").submit(function(e) {
        e.preventDefault();
        $("#submit-text-form").click();
    })*/
    
    $("#submit-text-form").on('click', function(e) {
        e.preventDefault();
        text = $("#new-text").val();
        //alert(text);
        $("#new-text-box").addClass("hidden");
        $("#new-text").val("");
        disableSpacebar = true;
        
        restart();
    })
    
    $("#cancel-text-form").on('click', function(e) {
        e.preventDefault();
        $("#new-text-box").addClass("hidden");
        disableSpacebar = true;
    })
    
    $("#pick-text").on('click', function() {
        $("#new-text-box").addClass("hidden");
        $("#text-selector").removeClass("hidden");
    })
    
    $("#cancel-text-choice").on('click', function(e) {
        e.preventDefault();
        $("#text-selector").addClass("hidden");
    })
    
    $("#submit-text-choice").on('click', function(e) {
        e.preventDefault();
        var book = $("#text-options option:selected").val();
        text = texts[book].line;
        restart();
        $("#text-selector").addClass("hidden");
    })
    
    $("#close-results-modal").on('click', function() {
        closeResultsModal();
        restart();
    })
    
    $("#tick").on('click', function() {
        moveToNextChar();
    })
})
