// Click and Drag an object
parent.locFrame = window;
parent.console.log('Sent my info to parent');
parent.addEventListener('touchstart', {});



var task = {}

//Stims
var grid = 80; // Pixel size of grid unit
var block = 4; // Block size that each primitive occupies
var canvas_w = 5*block*grid;
var canvas_h = 2.5*block*grid;
var button_y = 0.3*block*grid;// x, y as in GM convenction: origin in top left, x increasing to right, y increasing to bottom
var button_height = 0.2*block*grid;
var button_width = 0.5*block*grid;
var target = [[0]];
var textname = '';
// To synchronise logged times and real presentations: send triggers through signal pixel
var signal = 0;
// This pixel either flips (0 > 1 or 1 > 0) or blinks (0 > 1 > 0 or 1 > 0 > 1)
var flip = false;
// This time variable will be responsible for timer: next trial if Date.now()  - time > interval
var ref_time_StimOn = -1;
var interval_StimOn = 1500;
//var interval_StimOn = 150;
var ref_time_Fix = -1;
var interval_Fix = -1;//initial every time
var ref_time_Resp= -1;
var interval_Resp = 2000;
//var interval_Resp = 200;
var ref_time_FB = -1;
var interval_FB = 500;
var ref_time_ITI = -1;
var interval_ITI = -1;

var whetherFix = false;
var whetherStim = false;
var whetherText = false;
var whetherFB = false;
var whetherITI = false;
var whetherFail = false;
var testg=false;
var testd=false;
//Version 2
var whetherInstru = false;
function setup() {
  // Setup canvas
  createCanvas(canvas_w, canvas_h);
  // For some reason the button positions are relative to the window, not the canvas
  var origin = _renderer.position();  
  buttonRecord = createButton('开始游戏');  
  buttonPosition(buttonRecord,origin.x + canvas_w/2 - button_width/3,origin.y + 7*button_y,button_width-button_height,button_height,color(0, 0, 0, 255),clickStartGame)
}

function draw() {
    // White background
    background(255);
    if(!whetherInstru){
      presentMarker();

    }
      // Set the value of fullscreen 
      // into the variable 
    // Take care of timer

    if(whetherInstru){
      presentInstru();
    }

    if (whetherFix)
    {  
      presentFix();
      noCursor(); 

    }
    if(whetherStim){
      presentStim();
      noCursor(); 

    }
    if(whetherText){
      // parent.console.log("whetherText"+whetherText);
      // parent.console.log("whetherStim"+whetherStim);
      presentText();
      watchPress();//condition 2 - if pressWrong, going to feedback // condition 3 if press right, going to ITI
      noCursor(); 

    }
    if(whetherFB){
      presentFB();
      noCursor(); 

    }
    if(whetherITI){
      presentIti();
      noCursor(); 

    }
    if(ref_time_Fix > -1 && (Date.now()  - ref_time_Fix) >= interval_Fix){
      task.loc_time_fix[task.loc]=Date.now() - ref_time_Fix;
      flip = !flip;
      signal = 1 - signal;  

      whetherFix = false;
      whetherStim = true;
      // parent.console.log("task.loc_time_fix"+[task.loc]+":"+task.loc_time_fix[task.loc] );
      // parent.console.log("task.loc_time_fix Duration "+[task.loc]+":"+interval_Fix );
      // parent.console.log("task.loc_time_fix Start "+[task.loc]+":"+ref_time_Fix );

      ref_time_Fix = -1;
      ref_time_StimOn = Date.now() ;
      task.loc_start_Stim[task.loc]=ref_time_StimOn;
       parent.console.log("RecordData:02_loc_start_Stim");

    }
    if(ref_time_StimOn > -1 && Date.now()  - ref_time_StimOn >= interval_StimOn){
      flip = !flip;
      signal = 1 - signal;  

      whetherStim = false;
      whetherText = true;
      task.loc_time[task.loc]=Date.now() - ref_time_StimOn;
       parent.console.log("RecordData:03_loc_time");

       ref_time_StimOn = -1;
      ref_time_Resp = Date.now() ;
      task.loc_start_text[task.loc] = ref_time_Resp;
       parent.console.log("RecordData:04_loc_start_text");

    }

    if(ref_time_Resp > -1 && Date.now()  - ref_time_Resp >= interval_Resp){
      flip = !flip;
      signal = 1 - signal;  

      whetherText = false;
      whetherFB = true;
      task.loc_start_response[task.loc]=null;
      task.loc_response[task.loc]=null;
      task.loc_ACCresponse[task.loc] = 0;
       ref_time_Resp = -1;
      ref_time_FB = Date.now() ;//condition 1 - if out of time, going to feedback
      task.loc_start_fb[task.loc]=ref_time_FB;
      // parent.console.log("task.loc_start_fb"+[task.loc]+":"+task.loc_start_fb[task.loc] );
      parent.console.log("RecordData:05_loc_start_fb");

    }
    
    if(ref_time_FB > -1 && Date.now()  - ref_time_FB >= interval_FB){
      flip = !flip;
      signal = 1 - signal;  

      whetherFB = false;
      whetherITI = true;

      ref_time_FB = -1;
      ref_time_ITI = Date.now() ;//condition 1 - if out of time, going to feedback
      task.loc_start_iti[task.loc]=ref_time_ITI;
      // parent.console.log("task.loc_start_iti"+[task.loc]+":"+task.loc_start_iti[task.loc] );
      parent.console.log("RecordData:06_loc_start_iti"); 
    }

    if(ref_time_ITI > -1 && Date.now()  - ref_time_ITI >= interval_ITI){
      task.loc_time_iti[task.loc]=Date.now() - ref_time_ITI;
      parent.console.log("RecordData:07_loc_time_iti"); 
      flip = !flip;
      signal = 1 - signal;  
      whetherITI = false;
      ref_time_ITI = -1;
      finishTrial()
    }
    
    if(whetherFail){
      noStroke();
      textSize(62); 
      fill(0); 
      text("请退出程序重新完成一次。", width / 2, height / 2); 
    }

}
function presentInstru(){
  textSize(52); 
  fill(0); 
  textAlign(CENTER, BOTTOM); 
  let lineHeight = textSize(); 
  text("开始按键测试,请分别按下左键（D键）或右键（G键）。", width / 2, height / 2 + lineHeight*4);
  if((key == "d"||key == "D")){
    testd=true;
    text("D", width / 2, height / 2 + lineHeight*2);
  }
  if((key == "g"||key == "G")){
    testg=true;
    text("G", width / 2, height / 2 + lineHeight*2);
  }
  if(testd&&testg){
    // startRecording();
     buttonRecord.show();
   }
}
function clickStartGame(){
  whetherInstru=false;
  testd=false;
  testg=false;
  whetherFix = true;
  ref_time_Fix = Date.now() ;
  task.loc_start_fix[task.loc]=ref_time_Fix;
  buttonRecord.hide();

}
function presentFix(){
  stroke(0); //  
  strokeWeight(4); //  
  var length = 48;
  var centerX = width / 2;
  var centerY = height / 2;
  line(centerX - length / 2, centerY, centerX + length / 2, centerY);
  line(centerX, centerY - length / 2, centerX, centerY + length / 2);
}

function presentStim(){

    // Draw shape
    noStroke();
    var draw_x = canvas_w/2 - target[0].length * grid / 2;
    var draw_y = canvas_h/2 - target.length * grid / 2;
    for (r = 0; r < target.length; r++)
    {
      for (c = 0; c < target[r].length; c++)
      {
      fill((1-target[r][c])*255); 
        stroke(255);
        rect(draw_x + c*grid, draw_y + r*grid, grid, grid);
      }
    }
}

function presentText(){

    // Draw textname
    noStroke();
    fill(0);
    textSize(55);    
    textAlign(CENTER, BOTTOM);
    //parent.console.log("draw textname"+textname);
    text(textname, canvas_w/2, canvas_h/2);
    
}
function watchPress(){

    if((key == "d"||key == 'g'||key=='D'||key=='G')&&keyIsPressed){
      noStroke();

      ref_time_Resp = -1;//would never going to condition 1
      task.loc_start_response[task.loc]=Date.now();
      parent.console.log("RecordData:04_loc_start_response"); 

      //parent.console.log("task.loc_start_response"+[task.loc]+":"+task.loc_start_response[task.loc] );
      // if ((key == 'd'||key=='D') && task.subjectTag % 2 == 0) {
      //   task.loc_response[task.loc] = 1; // e.g. sub-40, d = correct; 
      // } else if ((key == 'g'||key=='G')&& task.subjectTag % 2 == 0) {
      //   task.loc_response[task.loc] = 0; // e.g. sub-40, d = correct; 

      // } else if ((key == 'd'||key=='D') && task.subjectTag % 2 == 1) {
      //   task.loc_response[task.loc] = 0; // e.g. sub-41, d = false; 

      // } else if ((key == 'g'||key=='G') && task.subjectTag % 2 == 1) {
      //   task.loc_response[task.loc] = 1; // e.g. sub-41, d = false; 
      // }
      //sub-41 Version 
      // if ((key == 'd'||key=='D') && task.subjectTag % 2 == 1) {
      //   task.loc_response[task.loc] = 1; // e.g. sub-40, d = false; 
      // } else if ((key == 'g'||key=='G')&& task.subjectTag % 2 == 1) {
      //   task.loc_response[task.loc] = 0; // e.g. sub-40, d = false; 

      // } else if ((key == 'd'||key=='D') && task.subjectTag % 2 == 0) {
      //   task.loc_response[task.loc] = 0; // e.g. sub-41, d = correct; 

      // } else if ((key == 'g'||key=='G') && task.subjectTag % 2 == 0) {
      //   task.loc_response[task.loc] = 1; // e.g. sub-41, d = correct; 
      // }
      // sub-42 Version
      if ((key == 'd'||key=='D') && (task.subjectTag == 41 ||  task.subjectTag == 42 || task.subjectTag == 44 ||  task.subjectTag == 48 || task.subjectTag == 50|| task.subjectTag == 53|| task.subjectTag == 54|| task.subjectTag == 55|| task.subjectTag == 57|| task.subjectTag == 64|| task.subjectTag == 65)) {
        task.loc_response[task.loc] = 1; // e.g. sub-40, d = correct; 
      } else if ((key == 'g'||key=='G')&& (task.subjectTag == 41 ||  task.subjectTag == 42 || task.subjectTag == 44 ||  task.subjectTag == 48 || task.subjectTag == 50|| task.subjectTag == 53|| task.subjectTag == 54|| task.subjectTag == 55|| task.subjectTag == 57|| task.subjectTag == 64|| task.subjectTag == 65)) {
        task.loc_response[task.loc] = 0; // e.g. sub-40, d = correct; 

      } else if ((key == 'd'||key=='D') && (task.subjectTag == 43 ||  task.subjectTag == 45 || task.subjectTag == 46 ||  task.subjectTag == 47 || task.subjectTag == 49|| task.subjectTag == 51 || task.subjectTag == 52|| task.subjectTag == 56 || task.subjectTag == 58|| task.subjectTag == 59 || task.subjectTag == 60|| task.subjectTag == 61 || task.subjectTag == 62||task.subjectTag == 63)) {
        task.loc_response[task.loc] = 0; // e.g. sub-41, d = false; 

      } else if ((key == 'g'||key=='G') && (task.subjectTag == 43 ||  task.subjectTag == 45 || task.subjectTag == 46 ||  task.subjectTag == 47 || task.subjectTag == 49|| task.subjectTag == 51 || task.subjectTag == 52|| task.subjectTag == 56 || task.subjectTag == 58|| task.subjectTag == 59|| task.subjectTag == 60|| task.subjectTag == 61 || task.subjectTag == 62||task.subjectTag == 63)) {
        task.loc_response[task.loc] = 1; // e.g. sub-41, d = false; 
      }
      // parent.console.log("task.loc_response"+[task.loc]+":"+task.loc_response[task.loc] );
      // parent.console.log("task.loc_response right"+[task.loc]+":"+task.loc_Coorectres[task.loc] );

      //condition 2 - if pressWrong, going to feedback 
      if(task.loc_response[task.loc]>-1 && task.loc_Coorectres[task.loc] != task.loc_response[task.loc]){
        flip = !flip;
        signal = 1 - signal;  

        whetherText = false;
        whetherFB = true;
        ref_time_FB = Date.now() ;
        task.loc_start_fb[task.loc]=ref_time_FB;
        task.loc_ACCresponse[task.loc] = 0;
        parent.console.log("RecordData:05_loc_start_fb"); 
        parent.console.log("RecordData:05_loc_ACCresponse"); 
      }else if(task.loc_response[task.loc]>-1 &&  task.loc_Coorectres[task.loc] == task.loc_response[task.loc]){
        // condition 3 if press right, going to ITI
        flip = !flip;
        signal = 1 - signal;  

        whetherText = false;
        whetherFB = false;
        whetherITI = true;
        ref_time_FB = -1;

        ref_time_ITI = Date.now() ;
        task.loc_start_iti[task.loc]=ref_time_ITI;
        task.loc_ACCresponse[task.loc] = 1;
        parent.console.log("RecordData:05_loc_start_iti"); 
        parent.console.log("RecordData:05_loc_ACCresponse"); 
       }


    }

}
function presentFB(){

  noStroke();
  textSize(62);
  fill(0); 
  if (task.loc_response[task.loc] != null){
    text("选择错误", width / 2, height / 2); 
  }else{
    text("请尽快反应", width / 2, height / 2); 
  }
  

}

function  presentIti(){
  noStroke();

}
function presentMarker(){
   
    // Draw signal pixel for given value
    noStroke();
    fill(signal*255);
    rect(0, 0, button_height*2.5, button_height*2.5);
    rect(canvas_w - button_height*2.5, 0, button_height*2.5, button_height*2.5);  
    
}
//function drawprogressbar{
    // Draw progress bar, if task started
    // if (Object.keys(task).length > 0)
    // {
    //   fill(87, 51, 255);    
    //   rect(button_width + 5, 5 + button_y, 
    //        Math.max(task.loc / task.n_locs * (canvas_w - 2*button_width - 10), (button_height - 10)), 
    //        button_height - 10, 
    //        (button_height - 10)/2);  
    //   noStroke();
    //   fill(255);
    //   textSize(18);  
    //   textAlign(LEFT, CENTER);
    //   text((task.loc + 1).toString() + '/' + task.n_locs.toString(), button_width+10, button_y+button_height/2);  
    // }
    // stroke(39, 3, 201);
    // noFill();
    // rect(button_width + 5, 5 + button_y, canvas_w - 2*button_width - 10, button_height - 10, (button_height -10)/2);  
//}
function initTask(in_task){
  // This function is going to be called by parent html,
  // providing task specifics
  task = in_task;
  task.currentID ="FuncLoc";

  // Initialise trial
  initTrial();
}

function initTrial() {
  // Call parent function and store current task 
  // if(!initial){
    parent.finishedTrace(window);  
    var header = parent.document.getElementById('header');
    header.style.visibility="hidden"
  // }
  // parent.initial=False
  // Start timer
  if(task.loc==-1){
    whetherFix=false;
    whetherInstru = true;

  }else{
    whetherFix=true
    ref_time_Fix = Date.now() ;
    task.loc_start_fix[task.loc]=ref_time_Fix;
    
    parent.console.log("RecordData:01_loc_start_fix"); 
  }
 
  // parent.console.log("task.loc_start_fix"+[task.loc]+":"+task.loc_start_fix[task.loc] );
  interval_Fix = random(300, 701);
  interval_ITI = random(300, 701);
  task.loc += 1;
  // Initialise values in trial dictionary
  target = task.loc_shape[task.loc];
  textname = task.loc_text[task.loc];
  // Flip to signal start of trial

  buttonRecord.hide();
}

function finishTrial() {
  // Add solution to trial: the components in the submitted solution
  // Move to next trial
  if (task.loc < (task.n_locs - 1))
  {
    parent.console.log("task.loc"+task.loc)

      // Start new trial
      var sum = 0;
      for (let i = 0; i < task.loc_ACCresponse.length; i++) {
        if(task.loc_ACCresponse[i]==0){
          sum += 1;
        }
      }
      if(sum >= (task.n_locs *0.15)  ){ //0.15
          noStroke();

          task.session = 'FuncLocFail';
          parent.saveData();

          whetherFail = true;

      }else {
        initTrial();
      }
  }
  else
  {
    parent.console.log("task.loc"+task.loc)
    var header = parent.document.getElementById('header');
    header.style.visibility="visible";
    parent.nextTab();

    parent.saveData();
    remove();

  }      
}
function keyPressed() {
  console.log("Key Pressed: " + key);
}
function buttonPosition(buttonName,x,y,z,k,color,mousePressedCallback){
  buttonName.position(x, y);
  buttonName.size(z, k);
  buttonName.style('color',color );
  buttonName.style('font-size', '18px');
  buttonName.mousePressed(mousePressedCallback);  
}