/** modal.js - JavaScript for Citation Tic-Tac-Toe for modal dialog boxes to ask questions.
 *
 */

var questions = [
    {   question:   'Veronica Smith\nMr. Thornton\nU.S. History -- Per. 2\n10 Sept. 2016\n' +
                    'Question: Is this a proper MLA heading?',
        answers:    ['a: Yes', 'b: No'],
        correct:    'b',
        notes:      'No. In your heading, the month should be spelled out (10 September 2016).' +
                    'Incorrect Answer: Yes, it is correct.'
    },
    {   question:   'Are in-text citations the same thing as parenthetical citations?',
        answers:    ['a. Yes, they are the same thing.','b. No, they are different.'],
        correct:    'a',
        notes:      ''
    },
    {   question:   'Does MLA 8 allow you to underline, italicize, or bold the title of your paper?',
        answers:    ['a. Yes, titles can be styled to your choosing.',
                     'b. No, in MLA 8, titles should be not be underlined, italicized, or bolded.',
                     'c. Only with prior written consent of the Commissioner of Baseball.'],
        correct:    'b',
        notes:      ''
    },
    {   question:   'Choose the proper format for your MLA 8 paper:',
        answers:    ['a. Single-spaced, 12 pt. Arial font',
                     'b. Double-spaced, 14 pt. Times New Roman font',
                     'c. Double-spaced, 12 pt. Times New Roman font'],
        correct:    'c',
        notes:      ''
    },
    {   question:   'Choose the correct way to list your sources on your Works Cited document:',
        answers:    ['a. List them in the order that they appear in your paper.',
                     'b. List them in alphabetical (A to Z) order.'],
        correct:    'b',
        notes:      ''
    },
    {   question:   'Which method of indentation do you use on your works cited document when formatting your citations:',
        answers:    ['a. Hanging indent', 'b. Block indent.'],
        correct:    'a',
        notes:      ''
    },
    {   question:   'A quote that goes over four lines of text:',
        answers:    ['a. Is considered plagiarism.',
                     'b. Should be block indented.',
                     'c. Indicates that you are doing it wrong.'],
        correct:    'b',
        notes:      ''
    },
    {   question:   'When do you cite a source in your paper?',
        answers:    ['a. When you directly quote someone or something',
                     'b. When you interview someone and use something that they said.',
                     'c. When you use common knowledge -- like "Water freezes at 32 degrees F".',
                     'd. When you put a direct quote into your own words.',
                     'e. (a), (b), and (d) only.'],
        correct:    'e',
        notes:      ''
    },
    {   question:   'In this citation, what is the title of the book?\n' +
                    'Barnaby, Benjamin. Cool Science for Middle School Science Fairs, Yale UP, 2010.',
        answers:    ['a. Barnaby, Benjamin',
                     'b. Cool Science for Middle School Science Fairs. (You can tell, because the title is in italics).',
                     'c. Yale UP',
                     'd. 2010'],
        correct:    'b',
        notes:      ''
    },
    {   question:   'What type of source is this citation for?\n' +
                    'Garner, Anthony. "History of 20th Century Literature." Literature Database, www.litdb.com/history/20th-century.html. Accessed 16 Aug. 2016.',
        answers:    ['a. A book on 20th Century Literature.',
                     'b. A journal article in a database.',
                     'c. A webpage.'],
        correct:    'c',
        notes:      ''
    },
    {   question:   'If the reader of your paper wants more information on a source cited in-text, where do they look for more information?',
        answers:    ['a. The Internet.', 'b. The index.', 'c. Your work\'s cited document.'],
        correct:    'c',
        notes:      '(c) Your works cited document provides a full citation which gives the reader information about the in-text source you provide.'
    },
    {   question:   'What type of source is this citation for?\n' +
                    'Stanton, Daniel. "Methods of Analysis in Research Papers." Science of Informatics, vol. 12, no. 2, 2011, pp. 2-15. JSTOR, doi:10.10.5.1/access_secure_doc#30892. Accessed 11 Oct. 2015.',
        answers:    ['a. A non-peer-reviewed journal article',
                     'b. An astronomical database of research standards.',
                     'c. A journal article in a database called JSTOR.',
                     'd. A german shepard puppy.'],
        correct:    'c',
        notes:      ''
    },
    {   question:   'In this citation, what is the name of the publisher?\n' +
                    'Jones, Andrew. "The Cambodian Genocide." Genocide: A comprehensive introduction, Routledge, 2006, pp. 40-60.',
        answers:    ['a. Jones, Andrew', 'b. "The Cambodian Genocide."', 'c. Genocide: A comprehensive introduction',
                     'd. Routledge', 'e. 2006', 'f. pp. 40-60'],
        correct:    'd',
        notes:      ''
    },
    {   question:   'In this citation, what does et al. stand for?\n +' +
                    'Pearsall, Mitchell, et al. A Concise History of Central America, Cambridge UP, 2015.',
        answers:    ['a. The words et al. are a suffix to the author\'s name',
                     'b. The words et al. mean "and others", because there are more than three authors.',
                     'c. The words et al. mean there are editors and authors for this book.'],
        correct:    'b',
        notes:      '(b) The words et al. is latin for "and others" and is used when there are 3+ authors or 2+ editors.'
    },
    {   question:   'When citing sources in your paper:',
        answers:    ['a. You only need to cite each source one time, no matter how often you use it.',
                     'b. You should cite direct quotes at the end of the sentence where it is used.'],
        correct:    'b',
        notes:      '(b) You should cite direct quotes at the end of the sentence where it is used.'
    },
    {   question:   'In MLA 8, are you required to include page numbers at the top of your works cited and/or annotated bibliography pages?',
        answers:    ['a. No, only your paper needs to have page numbers',
                     'b. Yes, your paper, works cited, and annotated bibliography should have a running page number from the beginning of the document to the end.'],
        correct:    'b',
        notes:      '(b) Yes, there should be pages numbers provided for the entire document from beginning to end.'
    },
    {   question:   'Where in your paper does your works cited go?',
        answers:    ['a. On the same page right after the last paragraph of your paper.',
                     'b. On page one of your document.',
                     'c. On a separate page after your paper.'],
        correct:    'c',
        notes:      ''
    },
    {   question:   'What would be considered a "container" in MLA 8?',
        answers:    ['a. A TV show.','b. a book.', 'c. A journal', 'd. A website', 'e. A database', 'f. All of the above.'],
        correct:    'f',
        notes:      'These are all considered containers in MLA 8.'
    },
    {   question:   'These are book citations. Which one is correct?',
        answers:    ['a. Baron, Sandra. Yosemite National Park. New York: Chelsea, 2010, pp. 2-10.',
                     'b. Baron, Sandra. Yosemite National Park, Chelsea, 2010, pp. 2-10.'],
        correct:    'b',
        notes:      '(b) is correct. You no longer include the city of publication in a citation. It is now optional and used only in special cases.'
    },
    {   question:   'When using NoodleTools to cite your sources, do you have to fill in every single box to get a proper citation?',
        answers:    ['a. Yes. That\'s why the boxes are there.','b. No. Only fill in the boxes necessary for the source you are citing.'],
        correct:    'b',
        notes:      '(b)  No. Only fill in the boxes necessary for the source you are citing.'
    },
    {   question:   'When you block indent a direct quote, how many spaces or tabs do you use to indent?',
        answers:    ['a. Ten spaces or two tabs.','b. Five spaces or one tab.'],
        correct:    'b',
        notes:      '(b) Five spaces or one tab -- this is new to MLA 8.'
    },
    {   question:   'When citing a web source, whether from a website or a database, do you include a URL in your citation?',
        answers:    ['a. No. URLs are long and messy and should never be included.',
                     'b. Yes! URLs are required by the new MLA 8 style.'],
        correct:    'b',
        notes:      '(b) Yes! URLs are now required in your citations.'
    },
    {   question:   'Which citation is correct?',
        answers:    ['a. Johnson, Betty. "Abstract Art." Modern Art -- San Francisco, 24 Jan. 2015, www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015.',
                     'b. Johnson, Betty. "Abstract Art." Modern Art -- San Francisco, 24 Jan. 2015, http://www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015.'],
        correct:    'a',
        notes:      '(a) is correct. In the URL, you do NOT include the "http://" prefix. Start with whatever comes after the // marks.'
    },
    {   question:   'Which example is a proper in-text (parenthetical) citation?',
        answers:    ['a. (239 Smith).','b. (Smith, 239).', 'c. (Smith, p. 239).', 'd. (Smith 239).'],
        correct:    'd',
        notes:      '(d) (Smith 239). is correct. There is no comma, and no p. used in the parenthetical citation.'
    },
    {   question:   'Is this the correct order to list these citations on your works cited? How do you know what order to put them in?\n' +
                    'Smith, John. "Modern World History."\n' +
                    'Smith, John. "World History Overview."',
        answers:    ['a. Yes','b. No'],
        correct:    'a',
        notes:      'Yes, this is the correct order to list them. Since the author\'s name is the same -- you have to alphabetize by the Title. So, "Modern" is before "World".'
    },
    {   question:   'If a webpage citation has no author, what part of the citation do you use as the in-text or parenthetical citation?',
        answers:    ['a. The webpage article title (which is in quotes).','b. The publisher of the website.'],
        correct:    'a',
        notes:      'The webpage article title would be the next part of your citation, after an author\'s name, so you would use the article title as your in-text citation.'
    },
    {   question:   'What is the password to log in to the Library website?',
        answers:    ['a. lions','b. library', 'c: JSerra'],
        correct:    'c',
        notes:      ''
    }
];

var gQuestionObject = null;

function askRandomQuestion(parent) {
    //console.log('askRandomQuestion');
    // Pick a random question object.
    gQuestionObject = questions[Math.floor(Math.random() * questions.length)];
    var i;

    var modalElem = $('#question-modal');
    var modalBodyElem = $('#question-body');
    var modalFooterElem = $('#question-footer');

    // Get rid of any old questions and answers.
    $('#question-body p').remove();
    $('#question-footer-p').text('');

    // Add the question and the answers to the modal-body.
    var questionParts = gQuestionObject.question.split('\n');
    for (i = 0; i < questionParts.length; i++) {
        $('<p>').text(questionParts[i]).appendTo(modalBodyElem);
    }

    for (i = 0; i < gQuestionObject.answers.length; i++) {
        var answer = gQuestionObject.answers[i];

        var ansElem = $('<p>').text(gQuestionObject.answers[i]);
        // Mark which answer is correct.
        if (answer[0] === gQuestionObject.correct) {
            ansElem.addClass('right-answer');
        } else {
            ansElem.addClass('wrong-answer');
        }

        // Click handler for the answer paragraphs.
        ansElem.click(function() {
            //console.log('Model click handler');
            var correct;

            // Reveal all the right and wrong answers.
            $('#question-body p').addClass('revealed');

            // Set the footer based on whether this is the right answer.
            if ($(this).hasClass('right-answer')) {
                //console.log('Right answer');
                $('#question-footer-p').text('Correct! ' + gQuestionObject.notes);
                correct = true;
            } else {
                //console.log('Wrong answer');
                $('#question-footer-p').text('Incorrect! ' + gQuestionObject.notes);
                correct = false;
            }
            parent.completeCurrentTurn(null, correct);
        });

        ansElem.appendTo(modalBodyElem);
    }

    modalElem.modal('show');
}

function displayNotifyModal(newText) {
    //console.log('displayNotifyModal');

    var modalElem = $('#notify-modal');
    var modalBodyElem = $('#notify-body');

    // Get rid of any old questions and answers.
    $('#notify-body p').text(newText);

    modalElem.modal('show');
}