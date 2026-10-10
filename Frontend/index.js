        // Function to show a specific section
        function showSection(sectionId){

            // hide all menu pages
            let pages = document.querySelectorAll(".menu-page");

            pages.forEach(function(page){
                page.style.display = "none";
            });

            // show selected section
            let selected = document.getElementById(sectionId);

            if(selected){
                selected.style.display = "block";

                // scroll to that section
                selected.scrollIntoView({behavior: "smooth"});
            }

        }

        // Function to go back to the home page
        function goHome(){

            let pages = document.querySelectorAll(".menu-page");

            pages.forEach(function(page){
                page.style.display = "none";
            });

            document.getElementById("categoriesSection").style.display = "block";
            document.getElementById("homeMenu").style.display = "block";

            window.scrollTo(0,0);

        }