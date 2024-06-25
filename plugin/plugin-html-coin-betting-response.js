var jsPsychHtmlCoinBettingResponse = (function (jspsych) {
  'use strict';

  const info = {
      name: "html-coin-betting-response",
      parameters: {
          /** The HTML string to be displayed */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          /** Label of the button to advance. */
          button_label: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Button label",
              default: "Continue",
              array: false,
          },

          images: {
            type: jspsych.ParameterType.IMAGE,
            pretty_name: "List of images that participants can bet on",
            default: undefined,
            array: true,
          }

      },
  };

  var JSPSYCH_MAX_COINS = 10;
  /**
   * **html-coin-betting-response**
   *
   * jsPsych plugin for showing an HTML stimulus and collecting betting responses with coins
   *
   * @author Josh de Leeuw, Sebastian Schuster
   */
  class HtmlCoinBettingResponsePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          // half of the thumb width value from jspsych.css, used to adjust the label positions
          
          var html = '<div id="jspsych-html-coin-betting-response-wrapper">';
          html += '<div>' + trial.stimulus +  '</div>';
          html += '<div>';
          html += '<table>';
          html += '<tr>';
          for (var j = 0; j < trial.images.length; j++) {
            html += '<td style="padding-bottom:20px;" class="jspsych-betting-col-' + j + '"><img id="jspsych-betting-img-' + j + '" src="' + trial.images[j] + '"></td>';
          }
          html += '</tr>';
          html += '<tr style="text-align:right;">';

          for (var j = 0; j < trial.images.length; j++) {
            html += '<td style="opacity: 1" class="jspsych-betting-col-' + j + '"><img id="jspsych-betting-coins-' + j + '" class="jspsych-betting-coin" src="./img/coins_0.png" width="75" height="45"></td>';
          }
          html += '</tr>';
          html += '<tr>';
          for (var j = 0; j < trial.images.length; j++) {
            html += '<td style="opacity: 1" class="col-1"><input type="button"  class="jspsych-betting-button jspsych-betting-control" data-target="' + j + '" value="&ndash;"> <input type="button" class="jspsych-betting-button jspsych-betting-control" data-target="' + j + '" value="+"></td>'
          }
          html += '</tr>';
          html += '</table>'
          html += '</div>';

          html += '<div style="padding: 20px 0;">';
		  html += '<p style="width:145px; float: left; margin: 5px 0 0 0;">Available coins:</p> <img src="./img/coins_10.png" id="jspsych-betting-available-coins" width="75" height="45" style="float:left;display: block;">';
          
          html += '<button id="jspsych-html-coin-betting-response-next" class="jspsych-btn" disabled ' +
                  ">" +
                  trial.button_label +
                  "</button>";;
	      html += '<p style="width:220px; float: right;"></p>';
		  html += '</div>';
		
          html += '</div>';
          
        
          display_element.innerHTML = html;
          var response = {
              rt: null,
              response: null,
          };


          const tally_coins = () => {
            var total = Array.from(display_element.querySelectorAll(".jspsych-betting-coin").values()).map(function(x) {
                return parseInt(x.getAttribute("src").split("coins_")[1].replace(".png", ""));
            })
            .reduce(function(acc, val) {
                return acc + val;
            });
            if (total == JSPSYCH_MAX_COINS) {
                display_element.querySelectorAll(".jspsych-betting-control").forEach(function(b) {
                if (b.value != "+") return;
                b.disabled = true;
                });
                display_element.querySelector("#jspsych-html-coin-betting-response-next").disabled = false;
            } else {
                display_element.querySelectorAll(".jspsych-betting-control").forEach(function(b) {
                if (b.value != "+") return;
                b.disabled = false;
                });
                display_element.querySelector("#jspsych-html-coin-betting-response-next").disabled = true;
            }
            display_element.querySelector("#jspsych-betting-available-coins").setAttribute("src", "./img/coins_" + (JSPSYCH_MAX_COINS-total) + ".png");
          };

          

          const end_trial = () => {
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // save data
              var trialdata = {
                  rt: response.rt,
                  stimulus: trial.stimulus,
              };
              for (var j = 0; j < trial.images.length; j++) {
                trialdata["response_" + j] = response.response[j];
                trialdata["target_image_" + j] = trial.images[j];
              }
              display_element.innerHTML = "";
              // next trial
              this.jsPsych.finishTrial(trialdata);
          };
          display_element
              .querySelector("#jspsych-html-coin-betting-response-next")
              .addEventListener("click", () => {
              // measure response time
              var endTime = performance.now();
              response.rt = Math.round(endTime - startTime);
              response.response = [];

              display_element
              .querySelectorAll(".jspsych-betting-coin")
              .forEach(coins => {
                var val = parseInt(coins.getAttribute("src").split("coins_")[1].replace(".png", ""));
                response.response.push(val);
              });
              
              end_trial();
          });
         

          display_element.querySelectorAll(".jspsych-betting-control").forEach(function(b) {
            if (b.value != "+")  
              b.disabled = true;
          });

          display_element
            .querySelectorAll(".jspsych-betting-control").forEach((b) => {
                b.addEventListener("click", (e) => {
                    var target = e.target.dataset.target;
                    var coins = display_element.querySelector("#jspsych-betting-coins-" + target).getAttribute("src").split("coins_")[1].replace(".png", "");
                    coins = parseInt(coins) + ((e.target.value == "+") ? 1 : -1); 
                    display_element.querySelector("#jspsych-betting-coins-" + target).setAttribute("src", "./img/coins_" + coins + ".png"); 
                    if (coins == 0) {
                        e.target.disabled = true;
                    } else if (e.target.value == "+") {
                        e.target.parentNode.querySelector(".jspsych-betting-control").disabled = false;
                    }
                    tally_coins();
                });
            });
          tally_coins();

          var startTime = performance.now();

      }
     
  }
  HtmlCoinBettingResponsePlugin.info = info;

  return HtmlCoinBettingResponsePlugin;

})(jsPsychModule);
