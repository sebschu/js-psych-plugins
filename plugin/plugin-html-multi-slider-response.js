var jsPsychHtmlMultiSliderResponse = (function (jspsych) {
  'use strict';

  const info = {
      name: "html-multi-slider-response",
      parameters: {
          /** The HTML string to be displayed */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          /** Sets the minimum value of the slider. */
          min: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Min slider",
              default: 0,
          },
          /** Sets the maximum value of the slider */
          max: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Max slider",
              default: 100,
          },
          /** Sets the starting value of the slider */
          slider_start: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Slider starting value",
              default: 0,
          },
          /** Sets the number of sliders */
          num_sliders: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Number of sliders",
            default: 1,
          },
          /** If set, the total value of all sliders has to match this value */
          force_total: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Force total across sliders",
            default: null,
          },

          /** Sets the step of the slider */
          step: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Step",
              default: 1,
          },
          /** Array containing the labels for the slider. Labels will be displayed at equidistant locations along the slider. */
          labels: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Labels",
              default: [],
              array: true,
          },
          /** Array containing the labels displayed left of the sliders. */
          slider_labels: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Labels displayed left of the slider",
            default: [],
            array: true,
          },
          
          /** Width of the slider in pixels. */
          slider_width: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Slider width",
              default: null,
          },
          /** Label of the button to advance. */
          button_label: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Button label",
              default: "Continue",
              array: false,
          },
          /** If true, the participant will have to move the slider before continuing. */
          require_movement: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Require movement",
              default: false,
          },
          /** Any content here will be displayed below the slider. */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /** How long to show the stimulus. */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /** How long to show the trial. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /** If true, trial will end when user makes a response. */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
      },
  };
  /**
   * **html-multi-slider-response**
   *
   * jsPsych plugin for showing an HTML stimulus and collecting multiple slider responses
   *
   * @author Josh de Leeuw, Sebastian Schuster
   */
  class HtmlMultiSliderResponsePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          // half of the thumb width value from jspsych.css, used to adjust the label positions
          var half_thumb_width = 7.5;
          var html = '<div id="jspsych-html-slider-response-wrapper" style="margin: 100px 0px;">';
          html += '<div id="jspsych-html-slider-response-stimulus">' + trial.stimulus + "</div>";
          html +=
              '<div class="jspsych-html-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
          if (trial.slider_width !== null) {
              html += "width:" + trial.slider_width + "px;";
          }
          else {
              html += "width:auto;";
          }
          html += '">';
          for (var j = 0; j < trial.num_sliders; j++) {
            html += '<div style="overflow: auto;">';
            html += '<span style="display:block; width:40%; float: left; font-weight:bold; margin: 0 10px; padding: 10px 0;">' + trial.slider_labels[j] + '</span>';
            html += '<span style="display:block; width:45%; float: left;">';
            html +=
              '<input type="range" class="jspsych-slider" value="' +
                  trial.slider_start +
                  '" min="' +
                  trial.min +
                  '" max="' +
                  trial.max +
                  '" step="' +
                  trial.step +
                  '" id="jspsych-html-multi-slider-response-response-' + j +  '"></input>';
            html += '</span>';
            html += '<span style="display:block; width:10%; float: left;">';
            //html += '<input type="number" size="3" style="width: 45px" placeholder="0" min="0" max="100" class="jspsych-number" id="jspsych-html-multi-slider-response-display-' + j +'"></input>'
            html +=
              '<input type="number" class="jspsych-number" size="3" style="width: 45px" placeholder="' +
                  trial.slider_start +
                  '" min="' +
                  trial.min +
                  '" max="' +
                  trial.max +
                  '" step="' +
                  trial.step +
                  '" id="jspsych-html-multi-slider-response-display-' + j +  '"></input>';
            html += '</span>';
            
            html += '</div>';
            
          }
          //debug check total
          //html += '<p>total: </p><input type="text" value="" id="debug-total"></input>';

          html += "<div>";
          for (var j = 0; j < trial.labels.length; j++) {
              var label_width_perc = 100 / (trial.labels.length - 1);
              var percent_of_range = j * (100 / (trial.labels.length - 1));
              var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
              var offset = (percent_dist_from_center * half_thumb_width) / 100;
              html +=
                  '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                      "left:calc(" +
                      percent_of_range +
                      "% - (" +
                      label_width_perc +
                      "% / 2) - " +
                      offset +
                      "px); text-align: center; width: " +
                      label_width_perc +
                      '%;">';
              html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
              html += "</div>";
          }
          html += "</div>";
          html += "</div>";
          html += "</div>";
          if (trial.prompt !== null) {
              html += trial.prompt;
          }
          // add submit button
          html +=
              '<button id="jspsych-html-slider-response-next" class="jspsych-btn" ' +
                  (trial.require_movement || trial.force_total ? "disabled" : "") +
                  ">" +
                  trial.button_label +
                  "</button>";
          display_element.innerHTML = html;
          var response = {
              rt: null,
              response: null,
          };


          var slider_change_handler = function(e, force_total) {
            var id_parts = e.target.id.split("-");
            var j = id_parts[id_parts.length -1];
            display_element
            .querySelector("#jspsych-html-multi-slider-response-display-" + j)
            .value = e.target.value;
            if (force_total && trial.force_total != null) {
                var total = 0;
                display_element
                    .querySelectorAll(".jspsych-slider").forEach(s => {
                    total += s.valueAsNumber;
                    });

                    if (total > trial.force_total) {
                    e.target.value = e.target.valueAsNumber - (total - trial.force_total);
                    display_element
                        .querySelector("#jspsych-html-multi-slider-response-display-" + j)
                        .value = e.target.value;
                    }
                    
                    if (total < trial.force_total * 0.99) {
                    display_element
                    .querySelector("#jspsych-html-slider-response-next")
                    .disabled =  true;
                    } else {
                    display_element
                    .querySelector("#jspsych-html-slider-response-next")
                    .disabled =  false;
                    }

            }
          }

          var number_change_handler = function(e, force_total) {
            var id_parts = e.target.id.split("-");
            var j = id_parts[id_parts.length -1];
            display_element
            .querySelector("#jspsych-html-multi-slider-response-response-" + j)
            .value = e.target.value;
            if (force_total && trial.force_total != null) {
                var total = 0;
                display_element
                    .querySelectorAll(".jspsych-number").forEach(s => {
                    total += Number(s.value);
                    });

                    // debug check total
                    // display_element
                    // .querySelector("#debug-total")
                    // .value = total;

                    if (total > trial.force_total) {
                    e.target.value = e.target.valueAsNumber - (total - trial.force_total);
                    display_element
                        .querySelector("#jspsych-html-multi-slider-response-response-" + j)
                        .value = e.target.value;
                    }
                    
                    if (total < trial.force_total * 0.99) {
                    display_element
                    .querySelector("#jspsych-html-slider-response-next")
                    .disabled =  true;
                    } else {
                    display_element
                    .querySelector("#jspsych-html-slider-response-next")
                    .disabled =  false;
                    }

            }
          }

          display_element
          .querySelectorAll(".jspsych-slider").forEach(slider => {
            slider.addEventListener("input", e => slider_change_handler(e, false));
            slider.addEventListener("change", e => slider_change_handler(e, true));
        });

          display_element
          .querySelectorAll(".jspsych-number").forEach(number => {
            //slider.addEventListener("input", e => number_change_handler(e, false));
            number.addEventListener("change", e => number_change_handler(e, true));
        });
          

          const end_trial = () => {
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // save data
              var trialdata = {
                  rt: response.rt,
                  stimulus: trial.stimulus,
                  slider_start: trial.slider_start,
              };
              for (var j = 0; j < trial.num_sliders; j++) {
                trialdata["response_" + j] = response.response[j];
                trialdata["slider_" + j] = trial.slider_labels[j];
              }
              display_element.innerHTML = "";
              // next trial
              this.jsPsych.finishTrial(trialdata);
          };
          display_element
              .querySelector("#jspsych-html-slider-response-next")
              .addEventListener("click", () => {
              // measure response time
              var endTime = performance.now();
              response.rt = Math.round(endTime - startTime);
              response.response = [];

              display_element
              .querySelectorAll(".jspsych-slider")
              .forEach(slider => {
                response.response.push(slider.valueAsNumber);
              });
              
              if (trial.response_ends_trial) {
                  end_trial();
              } else {
                  display_element.querySelector("#jspsych-html-slider-response-next").disabled = true;
              }
          });
          if (trial.stimulus_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  display_element.querySelector("#jspsych-html-slider-response-stimulus").style.visibility = "hidden";
              }, trial.stimulus_duration);
          }
          // end trial if trial_duration is set
          if (trial.trial_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
          }
          var startTime = performance.now();
      }
     
  }
  HtmlMultiSliderResponsePlugin.info = info;

  return HtmlMultiSliderResponsePlugin;

})(jsPsychModule);
