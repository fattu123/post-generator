// ==UserScript==
// @name         Classic title and paragraph v2
// @namespace    http://tampermonkey.net/
// @version      2025-09-17
// @description  Automated post creation for WordPress Classic Editor
// @author       Your Group
// @match        http://cms.webug.se/grupp11/wordpress/wp-admin/post-new.php
// @match        http://cms.webug.se/grupp11/wordpress/wp-admin/post.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webug.se
// @grant        none
// @require      https://raw.githubusercontent.com/LenaSYS/ContextFreeLib/refs/heads/master/js/contextfreegrammar.js
// @require      https://raw.githubusercontent.com/LenaSYS/Random-Number-Generator/refs/heads/master/seededrandom.js
// @require      https://raw.githubusercontent.com/LenaSYS/ContextFreeLib/refs/heads/master/js/data_generator.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- LocalStorage-keys ---
    const LS_TARGET = '__bulk_target__';
    const LS_COUNT = '__bulk_count__';

    function storeLocalStorage(key, value) {
        localStorage.setItem(key, String(value));
    }

    function getLocalStorage(key) {
        return parseInt(localStorage.getItem(key), 10);
    }

    function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    function showPrompt() {
        if (!getLocalStorage(LS_TARGET)) {
            const n = parseInt(prompt('How many posts do you want to create?', '5'), 10);
            if (!Number.isFinite(n) || n <= 0) {
                return;
            }
            storeLocalStorage(LS_COUNT, 0);
            storeLocalStorage(LS_TARGET, n);
        }
    }

    function addTitle(seed) {
        const titleElement = document.getElementById("title");
        if (titleElement) {
            titleElement.value = generateTitle(seed);
        }
    }

    function addParagraph(seed) {
        const paragraphElement = document.getElementById("content");
        if (paragraphElement) {
            paragraphElement.value = generateContent(seed);
        }
    }

    function publishPost() {
        const publishButton = document.getElementById("publish");
        if (publishButton) {
            publishButton.click();
        }
    }

    async function createPost() {
        let currentPost = getLocalStorage(LS_COUNT);
        const totalPosts = getLocalStorage(LS_TARGET);

        console.log(`Progress: ${currentPost}/${totalPosts}`);

        if (currentPost < totalPosts) {
            currentPost++;
            storeLocalStorage(LS_COUNT, currentPost);

            await delay(1000);
            // Skicka in ett unikt seed-värde (currentPost)
            addTitle(currentPost);

            await delay(1000);
            // Skicka in ett unikt seed-värde (currentPost)
            addParagraph(currentPost);

            if (currentPost < totalPosts) {
                await delay(1000);
                window.open('http://cms.webug.se/grupp11/wordpress/wp-admin/post-new.php');
            }

            await delay(2000);
            publishPost();
        } else {
            console.log("All posts done!");
            localStorage.removeItem(LS_TARGET);
            localStorage.removeItem(LS_COUNT);
        }
    }

    if (window.top !== window.self) {
        return;
    }

    const url = window.location.href;
    if (!url.includes("post.php") && !url.includes("action=edit")) {
        console.log("On custom page");
        showPrompt();
        createPost();
    } else {
        console.log("On edit page");
        let currentPost = getLocalStorage(LS_COUNT);
        const totalPosts = getLocalStorage(LS_TARGET);

        console.log(`Progress: ${currentPost}/${totalPosts}`);

        if (currentPost < totalPosts) {
            window.open('http://cms.webug.se/grupp11/wordpress/wp-admin/post-new.php');
            window.close();
        } else {
            console.log("All posts done!");
            alert("All posts done!");
            localStorage.removeItem(LS_TARGET);
            localStorage.removeItem(LS_COUNT);
        }
    }

})();
