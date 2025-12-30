/**
 * ChaiPe Documentation Navigation
 * Handles documentation site navigation and active state
 */

(function() {
    'use strict';

    // Get current page path
    const getCurrentPath = function() {
        const path = window.location.pathname;
        return path.replace(/\/$/, '') || '/index.html';
    };

    // Set active navigation link
    const setActiveNav = function() {
        const currentPath = getCurrentPath();
        const navLinks = document.querySelectorAll('.docs-nav a');

        navLinks.forEach(function(link) {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || 
                (currentPath.includes(linkPath) && linkPath !== '/index.html')) {
                link.classList.add('active');
            }
        });
    };

    // Mobile menu toggle
    const initMobileMenu = function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.docs-sidebar');

        if (menuToggle && nav) {
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('open');
                menuToggle.classList.toggle('active');
            });
        }
    };

    // Smooth scroll to anchor links
    const initSmoothScroll = function() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Table of contents generation
    const generateTOC = function() {
        const content = document.querySelector('.docs-content');
        if (!content) return;

        const headings = content.querySelectorAll('h2, h3');
        if (headings.length < 3) return;

        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';

        const tocTitle = document.createElement('h4');
        tocTitle.textContent = 'Contents';
        tocContainer.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach(function(heading) {
            const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-');
            heading.id = id;

            const listItem = document.createElement('li');
            listItem.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-subitem' : 'toc-item';

            const link = document.createElement('a');
            link.href = '#' + id;
            link.textContent = heading.textContent;

            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });

        tocContainer.appendChild(tocList);

        const firstHeading = content.querySelector('h1, h2');
        if (firstHeading) {
            firstHeading.parentNode.insertBefore(tocContainer, firstHeading.nextSibling);
        }
    };

    // Copy code to clipboard
    const initCodeCopy = function() {
        document.querySelectorAll('.copy-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const codeBlock = this.parentElement.querySelector('code, pre');
                if (!codeBlock) return;

                const text = codeBlock.textContent;
                navigator.clipboard.writeText(text).then(function() {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(function() {
                        btn.textContent = originalText;
                    }, 2000);
                }).catch(function(err) {
                    console.error('Failed to copy:', err);
                });
            });
        });
    };

    // Tab functionality
    const initTabs = function() {
        document.querySelectorAll('.tab-button').forEach(function(button) {
            button.addEventListener('click', function() {
                const tabContainer = this.closest('.tabs');
                const tabId = this.getAttribute('data-tab');

                // Remove active class from all buttons and contents
                tabContainer.querySelectorAll('.tab-button').forEach(function(btn) {
                    btn.classList.remove('active');
                });
                tabContainer.querySelectorAll('.tab-content').forEach(function(content) {
                    content.classList.remove('active');
                });

                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const targetContent = tabContainer.querySelector('.tab-content[data-tab="' + tabId + '"]');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    };

    // Accordion functionality
    const initAccordion = function() {
        document.querySelectorAll('.accordion-header').forEach(function(header) {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isOpen = content.classList.contains('open');

                // Close all other accordions in the same container
                const accordion = this.closest('.accordion');
                accordion.querySelectorAll('.accordion-content').forEach(function(item) {
                    item.classList.remove('open');
                });

                // Toggle current accordion
                if (!isOpen) {
                    content.classList.add('open');
                }
            });
        });
    };

    // Search functionality (basic)
    const initSearch = function() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }

            const content = document.querySelector('.docs-content');
            if (!content) return;

            const headings = content.querySelectorAll('h1, h2, h3, h4');
            const results = [];

            headings.forEach(function(heading) {
                const text = heading.textContent.toLowerCase();
                if (text.includes(query)) {
                    results.push({
                        text: heading.textContent,
                        id: heading.id,
                        level: parseInt(heading.tagName.charAt(1))
                    });
                }
            });

            if (results.length > 0) {
                searchResults.innerHTML = results.map(function(result) {
                    return '<a href="#' + result.id + '" class="search-result-item">' +
                           '<span class="search-result-level">H' + result.level + '</span> ' +
                           result.text + '</a>';
                }).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
                searchResults.style.display = 'block';
            }
        });
    };

    // Initialize all features when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        setActiveNav();
        initMobileMenu();
        initSmoothScroll();
        generateTOC();
        initCodeCopy();
        initTabs();
        initAccordion();
        initSearch();
    });

})();
