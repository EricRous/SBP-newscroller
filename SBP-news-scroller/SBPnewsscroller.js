
// Created by Eric Rousey. 9/26/2016

function SBPnewsscroller(scrollerName, width, height, delay, database, imageWidth, H3Size, H4Size, options) {
$(document).ready(function() {

    var setDimensions = "width:" + width + ";" + "height:" + height + "; position: relative;";
    delay = delay * 1000;

    if (!options) {options = "allButtons";};
    options = options.toUpperCase();
    if (options == "NOBUTTONS") {options = "NOBOTTOMBUTTONS NOSIDEBUTTONS"};

    var containerClassName = "." + scrollerName;
    var scrollerClass = "." + scrollerName + "-news-scroller";
    var slideGroupClass = "." + scrollerName + "-slide-group";;
    var slideClass = "." + scrollerName + "-slide";
    var slideFirstChildClass = slideClass + ":first-child";
    var slideButtonsClass = "." + scrollerName + "-slide-buttons";
    var slideImageClass = "." + scrollerName + "-slide-image";
    var databaseContent = "";
    var button1Name = scrollerName + "button1";
    var button2Name = scrollerName + "button2";
    var h3Name = "." + scrollerName + "h3Class";
    var h4Name = "." + scrollerName + "h4Class";
    var slideImageClassWidth = "width: " + imageWidth + "; height: auto;"

    createNewClass(h3Name, "font-size: " + H3Size);
    createNewClass(h4Name, "font-size: " + H4Size);
    createNewClass(containerClassName,setDimensions);
    createNewClass(scrollerClass,"position: relative; overflow: hidden;");
    createNewClass(slideGroupClass,"width: 100%; height: 100%; position: relative;");
    createNewClass(slideClass,"width: 100%; height: 100%; display: none; position: absolute;");
    createNewClass(slideFirstChildClass,"display: block;");
    createNewClass(slideButtonsClass, "text-align:center; position: relative; top: -30px;");
    createNewClass(slideImageClass, slideImageClassWidth);
    createNewClass(".slide-btn","border-radius: 50%; background-color: #e7e7e7; color: black; font-size: 10px; outline: none; border: none;");
    createNewClass(".active-slide-btn","border-radius: 50%; background-color: #d8d8d8; color: black; font-size: 10px; outline: none;  border: none;");
    createNewClass(".button-spacer","width:5px; height:auto; display:inline-block;");
    createNewClass(".img-grow-effect","transition: transform .2s ease-in-out;");
    createNewClass(".img-grow-effect:hover","transform: scale(1.3);");

    databasePath = "SBP-news-scroller/" + database;

    getDatabase(databasePath, function(dataReturned)
        {
            databaseContent = dataReturned;

            var parsedData = parseDatabase(databaseContent);

            var generatedHTML = buildHTML(parsedData);

            $(containerClassName).html(generatedHTML);

            $(scrollerClass).css({"width": width, "height": height}); //set the width and height of the scroller

            $(scrollerClass).each(function()
                    {
                        var $this = $(this);
                        var $group = $this.find(slideGroupClass);
                        var $slides = $this.find(slideClass);
                        var buttonArray = [];
                        var currentIndex = 0;
                        var timeout;

                        function move(newIndex,reference)
                            {
                                var animateLeft, slideLeft;

                                advance();

                                if ($group.is(":animated") || currentIndex === newIndex) {return;}

                                if (!options.includes("NOBOTTOMBUTTONS"))
                                    {
                                        buttonArray[currentIndex].removeClass("active");
                                        buttonArray[currentIndex].removeClass("active-slide-btn");
                                        buttonArray[currentIndex].addClass("slide-btn");
                                        buttonArray[newIndex].addClass("active");
                                        buttonArray[newIndex].addClass("active-slide-btn");
                                    }

                                if (newIndex > currentIndex && reference != "leftDirectionButton")
                                    {
                                        slideLeft = "100%";
                                        animateLeft = "-100%";
                                    }
                                //this keeps moving the slides from left to right when the database resets to the first slide
                                else if (newIndex == 0 && reference != "leftDirectionButton")
                                    {
                                        slideLeft = "100%";
                                        animateLeft = "-100%";
                                    }
                                else if (newIndex == $slides.length - 1 && reference == "leftDirectionButton")
                                    {
                                        slideLeft = "-100%";
                                        animateLeft = "100%";
                                    }
                                else
                                    {
                                        slideLeft = "-100%";
                                        animateLeft = "100%";
                                    }

                                $slides.eq(newIndex).css( {left: slideLeft, display: "block"} );
                                $group.animate( {left: animateLeft} , function()
                                    {
                                        $slides.eq(currentIndex).css( {display: "none"});
                                        $slides.eq(newIndex).css( {left: 0});
                                        $group.css( {left: 0});
                                        currentIndex = newIndex;
                                    })

                            }

                        function directionButtons()
                            {
                                var $button1 = $("#" + button1Name);
                                var $button2 = $("#" + button2Name);
                                $button1.on("click", function()
                                    {
                                        if ( (currentIndex + 1) <= ($slides.length - 1) )
                                            {
                                                move(currentIndex + 1);
                                            }
                                        else
                                            {
                                                move(0);
                                            }
                                    });

                                $button2.on("click", function()
                                    {
                                        if ( (currentIndex - 1) >= 0 )
                                            {
                                                move(currentIndex - 1,"leftDirectionButton");
                                            }
                                        else
                                            {
                                                move($slides.length - 1,"leftDirectionButton");
                                            }
                                    });
                            }

                        function advance()
                            {
                                if (delay == 0)
                                    {
                                        return;
                                    }
                                else
                                    {
                                        clearTimeout(timeout);
                                        timeout = setTimeout(function()
                                            {
                                                if(currentIndex < ($slides.length - 1))
                                                    {
                                                        move(currentIndex + 1);
                                                    }
                                                else
                                                    {
                                                        move(0);
                                                    }
                                            }, delay);
                                    }
                            }

                    if (!options.includes("NOBOTTOMBUTTONS"))
                        {
                            $.each($slides, function(index)
                                {
                                var $button = $('<button type="button" class="slide-btn">&nbsp;</button><div class="button-spacer"/>');
                                if (index === currentIndex)
                                    {
                                        $button.removeClass("slide-btn");
                                        $button.addClass("active-slide-btn");
                                        $button.addClass("active");
                                    }
                                $button.on("click", function()
                                    {
                                        move(index);
                                    }).appendTo(slideButtonsClass);
                                buttonArray.push($button);
                                });
                        }

                        advance();
                        directionButtons();
                    });
        });

    function getDatabase(dbPath, callback)
        {
            $.get(dbPath, function(data)
                {
                    if (callback) {callback(data);}
                });
        }

    function createNewClass(className, rules)
         {
            var doesClassAlreadyExist = document.getElementsByClassName(className.substring(1));
            if (className == containerClassName) {doesClassAlreadyExist = [];};
            if (doesClassAlreadyExist.length == 0)
                {
                var style = document.createElement('style');
                style.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(style);
                if(!(style.sheet||{}).insertRule)
                    {(style.styleSheet || style.sheet).addRule(className, rules);}
                else
                    {
                    style.sheet.insertRule(className + "{" + rules + "}" , 0);
                    }
                }
            else
                {
                    return;
                }
        }

    function parseDatabase(data)
        {
            var fields = [0];
            var lines = data.split('\n');
            var delCount = 0;

            for(var line = 0; line < lines.length; line++)
                {
                    fields[(line - delCount)] = lines[line].split('\t');
                    //remove any blank lines:
                    if (!fields[(line - delCount)][0].match(/[a-z0-9]/i)) {fields.splice ((line - delCount),1); delCount = delCount + 1;}
                }

            return fields;
        }

    function buildHTML(rawData)
        {
            var html1 = '<div class="image-container" style="display: inline-block; position: relative;">' +
                '<img src="SBP-news-scroller/button1.png" ' +
                'style="position: absolute; left: 85%; top: 37%; width: 10%; z-index: 1; opacity: 0.1;"' +
                'id="' + button1Name + '" '  + 'alt="Right Button" class="img-grow-effect">' +
                '<img src="SBP-news-scroller/button2.png" ' +
                'style="position: absolute; left: 5%; top: 37%; width: 10%; z-index: 1; opacity: 0.1;" ' +
                'id="' + button2Name + '" '  + 'alt="Left Button" class="img-grow-effect">'
            var html15 = '<div class="' + scrollerClass.substring(1) + '"><div class="' +
                slideGroupClass.substring(1) + '">';
            var html2 = "";
            var html3 = '</div></div><center><div class="' + slideButtonsClass.substring(1) + '"></div></center>';

            for(var line = 0; line < rawData.length; line++)
                {
                    var realNum = line + 1;
                    var imgURL = "";
                    if (rawData[line][3].toLowerCase().includes("http"))
                        {
                            imgURL = '<img src= "' + rawData[line][3] + '" alt="' + rawData[line][4] +
                            '" class="' + slideImageClass.substring(1) + '">'
                        }
                    else if (rawData[line][3].match(/[a-z]/i))
                        {
                            imgURL = '<img src= "sbp-news-scroller/' + rawData[line][3] + '" alt="' + rawData[line][4] +
                            '" class="' + slideImageClass.substring(1) + '">'
                        }
                    else
                        {
                          imgURL = "";
                        }

                    html2 += '<div class="' + slideClass.substring(1) + ' slide' + realNum +
                        '"><p style="text-align:center;"><center><h3 class="' + h3Name.substring(1) +
                        '">' + rawData[line][0] +
                        '</h3><a href="' + rawData[line][1] +
                        '" target="_blank" style="text-decoration: none; color: black"> ' + imgURL +
                        '<br><h4 class="' + h4Name.substring(1) + '">' +
                        rawData[line][2] + '</h4></a></center></p></div>';
                }

            //html2 = html2.replace("'", "&#39;");
            var html4 = '</div>'

            var html = "";

            if (options.includes("NOSIDEBUTTONS"))
                {html = html15 + html2 + html3 + html4;}
            else
                {html = html1 + html15 + html2 + html3 + html4;}

            return html;
        }
});
  };

function SBPresize(scrollerName, width, height, newH3Size, newH4Size)
    {
    var H3present = null;
    var H4present = null;
    if (newH3Size) {H3present = newH3Size.match(/\d+/g);}
    if (newH4Size) {H4present = newH4Size.match(/\d+/g);}
    if (H3present != null) {var h3Name = "." + scrollerName + "h3Class";}
    if (H3present != null) {var h4Name = "." + scrollerName + "h4Class";}
    var setDimensions = "width:" + width + ";" + "height:" + height + "; position: relative;";
    var containerClassName = "." + scrollerName;
    var scrollerClass = "." + scrollerName + "-news-scroller";

    $(containerClassName).css("width", width);
    $(containerClassName).css("height", height);
    $(scrollerClass).css("width", width);
    $(scrollerClass).css("height", height);

    if (H3present != null)
        {
            $(h3Name).css("font-size", newH3Size);
        }

    if (H4present != null)
        {
            $(h4Name).css("font-size", newH4Size);
        }

    }
