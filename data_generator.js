// ==UserScript==
// @name         Data generator
// @namespace    http://tampermonkey.net/
// @version      2025-09-16
// @description  Generates random content and titles
// @author       You
// @match        *://cms.webug.se/grupp11/wordpress/wp-admin/post-new.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webug.se
// @require      https://raw.githubusercontent.com/LenaSYS/ContextFreeLib/refs/heads/master/js/contextfreegrammar.js
// @require      https://raw.githubusercontent.com/LenaSYS/Random-Number-Generator/refs/heads/master/seededrandom.js
// @grant        none
// ==/UserScript==

// Denna fil innehåller nu endast de funktioner som genererar texten.
// generateContent() och generateTitle() tar nu in en seed (siffra) som argument.
// Hela skriptet är nu omskrivet för att vara en modul som kan anropas från classic.js

function generateContent(seed)
{
    if (seed == undefined || isNaN(seed)) {
        seed = 1;
    }
    Math.setSeed(seed);

    var number_of_paragraphs = getRandomInt(1, 6);  // 1..5
    var number_of_sentences = getRandomInt(1, 11); // 1..10

    var sentences = "";
    for (var j = 0; j < number_of_paragraphs; j++) {
        for (var i = 0; i < number_of_sentences; i++) {
            sentences += generate_sentence(
                Math.random(), Math.random(), Math.random(), Math.random(),
                Math.random(), Math.random(), Math.random(), Math.random(),
                Math.random(), Math.random(), Math.random()
            );
        }
        if (j < number_of_paragraphs - 1) {
            sentences += "\n\n";
        }
    }
    return (sentences);
}

function generateTitle(seed)
{
    if (seed == undefined || isNaN(seed)) {
        seed = 1;
    }
    Math.setSeed(seed);

    var raw = generate_sentence(
        Math.random(), Math.random(), Math.random(), Math.random(),
        Math.random(), Math.random(), Math.random(), Math.random(),
        Math.random(), Math.random(), Math.random()
    );

    raw = raw.replace(/\.$/, "");
    var words = raw.split(" ");
    var wordCount = getRandomInt(1, Math.min(10, words.length) + 1);
    var title = words.slice(0, wordCount).join(" ");

    return (title);
}
