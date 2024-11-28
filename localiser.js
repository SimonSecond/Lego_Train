parent.locFrame = window;
parent.console.log('Sent my info to parent');
parent.addEventListener('touchstart', {});

var shapes = [];
var task = {};
var question_groups = [];
var target = [[0]];
var correctLabels = ["正确答案1", "正确答案2"];
var clickedChoices = [];
var rectangless = [];
var rectangles_store = [];
var start_store = [];
//var counter = 0;
//draw size small
var grid = 20; // Pixel size of grid unit
var block = 16; // Block size that each primitive occupies
var canvas_w = 5 * block * grid;
var canvas_h = 2.5 * block * grid;
// x, y as in GM convenction: origin in top left, x increasing to right, y increasing to bottom
var x_start = canvas_w / 2;
//Version 3 20240402
var y_start = 1 * block * grid; // Space for interface and target// var y_start = 0.5*block*grid;
var y_start_target = 1 * block * grid; // Space for interface and target
var x_target = 0;
var y_target = 0;
var button_y = 0.3 * block * grid;
var button_height = 0.2 * block * grid;
var button_width = 0.5 * block * grid;

var signal = 0;
var errorCount = 0;
var flip = false;
//Procedure
var shape_submitted = -1;
var timesRestart = -1;
//bulls
var whetherInstru = false;
var whetherFix = false;
var whetherOldTrial_Planning = false;
var whetherOldTrial_Clicking = false;
var whetherITI = false;
var whetherITI_Added = false;

var whetherOldTrial_Clicking_setup = true;

// Global variable to control reset behavior
var whetherresetShapes = false;

var click_finish = false;
let buttonOK;
let buttonRE;



var ref_time_Instru = -1;
var ref_time_Fix = -1;
var ref_time_OldTrial_Planning = -1;
var ref_time_OldTrial_Clicking = -1;
var ref_time_ITI = -1;
var ref_time_ITI_Added = -1;

var interval_Instru = 0.1;
var interval_Fix = -1;
var interval_OldTrial_Planning = 0;
//var interval_OldTrial_Planning  = 100;//debug
var interval_ITI = -1;
var interval_ITI_Added = -1;


//Version 3 20240402
let intervalID = null;
function setup() {
  createCanvas(canvas_w, canvas_h);
  origin = _renderer.position();
  buttonOK = createButton('提交');
  buttonRE = createButton('复原');

  buttonPosition(buttonOK, origin.x + canvas_w / 2 - button_width / 4, origin.y + canvas_h/2 - button_height/3, button_width / 1.5, button_height / 1.5, color(120, 120, 120, 255), clickSU);
  buttonPosition(buttonRE, origin.x + canvas_w / 2 - button_width / 4, origin.y, button_width / 1.5, button_height / 1.5, color(120, 120, 120, 255), clickRE);
}
let wtsaveBigCompData = false;
//Version 3 20240402

let selectedShapes = [];//存储选择的形状
let clickPositions = []; // 存储每次点击相对于target的位置
let clickPositions_old = [];

function draw() {
  buttonRE.hide();
  buttonOK.hide();
  background(255);
  //presentMarker();
  if (whetherInstru) {
    presentInstru();
    noCursor();

  }
  if (whetherFix) {
    presentFix();
    noCursor();

  }
  if (whetherOldTrial_Planning) {
    presentLargeTarget();
    noCursor();
  }
  if (whetherITI_Added) {
    presentITI_Added();
    noCursor();

  }
  if (whetherOldTrial_Clicking) {
    buttonRE.show();
    buttonOK.hide();
    presentLargeTarget();
    
    presentProbClick();
    
    cursor(ARROW);
/*     if (!intervalID) {
      intervalID = setInterval(logMousePosition, 2); // log every 0.5 seconds
    }
  } else {
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = null;
    }  */
  }

  if (whetherITI) {
    console.log("经过whetherITI");
    presentITI();
    noCursor();

  }



  if (ref_time_Instru > -1 && (Date.now() - ref_time_Instru) >= interval_Instru) {
    // flip = !flip;
    // signal = 1 - signal;  

    whetherInstru = false;
    whetherFix = true;

    ref_time_Instru = -1;
    ref_time_Fix = Date.now();
    task.Probe_start_fix[task.trial] = ref_time_Fix;
    parent.console.log("RecordData:01_Probe_start_fix");
    console.log("1");
  }

  if (ref_time_Fix > -1 && (Date.now() - ref_time_Fix) >= interval_Fix) {
    task.Probe_time_fix[task.trial] = Date.now() - ref_time_Fix;
    parent.console.log("RecordData:02_Probe_time_fix");

    flip = !flip;
    signal = 1 - signal;

    whetherFix = false;
    wtsaveBigCompData = true;
    whetherOldTrial_Planning = false;

    ref_time_Fix = -1;
    ref_time_OldTrial_Planning = Date.now();
    task.Probe_start_Planning[task.trial] = ref_time_OldTrial_Planning;
    parent.console.log("RecordData:03_Probe_start_Planning");
    console.log("2");
  }

  if (ref_time_OldTrial_Planning > -1 && (Date.now() - ref_time_OldTrial_Planning) >= interval_OldTrial_Planning) {
    flip = !flip;
    signal = 1 - signal;

    whetherOldTrial_Planning = false;
    whetherITI_Added = true;

    ref_time_OldTrial_Planning = -1;
    ref_time_ITI_Added = Date.now();
    task.Probe_start_iti_Added[task.trial] = ref_time_ITI_Added;
    parent.console.log("RecordData:04_Probe_start_iti_Added");
    console.log("3");
  }
  if (ref_time_ITI_Added > -1 && (Date.now() - ref_time_ITI_Added) >= interval_ITI_Added) {
    whetherITI_Added = false;
    task.Probe_time_iti_Added[task.trial] = Date.now() - ref_time_ITI_Added;
    parent.console.log("RecordData:05_Probe_time_iti_Added");

    ref_time_ITI_Added = -1;


    ref_time_OldTrial_Clicking = Date.now();
    task.Probe_start_Dragging[task.trial] = ref_time_OldTrial_Clicking;
    parent.console.log("RecordData:06_Probe_start_Dragging");
    whetherOldTrial_Clicking = true;
    task.mousePositions.push({time_begin: Date.now()});
    logMousePosition();
    console.log("4");
  }
  if (ref_time_ITI > -1 && (Date.now() - ref_time_ITI) >= interval_ITI) {
    flip = !flip;
    signal = 1 - signal;

    whetherOldTrial_Clicking_setup = true;
    whetherITI = false;
    task.Probe_time_iti[task.trial] = Date.now() - ref_time_ITI;
    parent.console.log("RecordData:08_Probe_time_iti");
    finishTrial();
    console.log("5");
  }
}


//*****************************function************************ */
//Version 3 20240402
function logMousePosition() {
  // console.log("Mouse Position:", mouseX, mouseY);
  task.mousePositions.push(
    { 
    Phase: 'probe', 
    Block: task.block_Curr, 
    Trial: task.trial, 
    targetID: task.trial_target_ids[task.trial],
    x: mouseX, 
    y: mouseY, 
    Mtime: Date.now() });
}

//****************************Main Process************* */
function initTask(in_task) {
  // This function is going to be called by parent html,
  // providing task specifics
  task = in_task;
  task.currentID = "Probe";
  //task.trial = 27; /////////////////////debug!!!!!!!!!!!!

  // Initialise trial
  initTrial();
}

function initTrial() {
  var header = parent.document.getElementById('header');
  header.style.visibility = "hidden"
  // Call parent function and store current task 
  parent.finishedTrace(window);
  whetherInstru = true;
  ref_time_Instru = Date.now();
  task.Probe_start_instru[task.trial + 1] = ref_time_Instru;
  //Probe_start_instru_0.1s_equals_to_iti
  parent.console.log("RecordData:00_Probe_start_instru");

  interval_Fix = random(300, 701);
  interval_ITI = random(300, 701);
  interval_ITI_Added = random(300, 701);

  hideShapes_element();
  task.trial += 1;
}
function presentInstru() {
  noStroke();
  textSize(52);
  fill(0);
  textAlign(CENTER, BOTTOM);
  let lineHeight = textSize();

};
function presentFix() {
  stroke(0); //  
  strokeWeight(4); //  
  var length = 48;
  var centerX = width / 2;
  var centerY = height / 2;
  line(centerX - length / 2, centerY, centerX + length / 2, centerY);
  line(centerX, centerY - length / 2, centerX, centerY + length / 2);
};

function presentLargeTarget() {
  target = task.trial_target[task.trial];
  // Center new target
  grid_2 = grid * 2;
  y_start_2 = y_start_target * 1.2
  drawtarget(target, grid_2, y_start_2);
  buttonRE.show();
  buttonOK.hide();
};

function presentProbClick() {
  if (whetherOldTrial_Clicking_setup) {
    ref_time_OldTrial_Clicking = Date.now();
    task.trial_start[task.trial] = ref_time_OldTrial_Clicking;
    parent.console.log("RecordData:06_trial_start");
    var choice_num = 8;
    // Create shape objects
    for (let s = 0; s < choice_num; s++)
      shapes[s] = new Draggable(0, 0, []);
    initShapes();

    whetherOldTrial_Clicking_setup = false;

    var new_event = {
      'type': 'Probe_Start_Clicking',
      'time': ref_time_OldTrial_Clicking,
      'positions': []
    };
    for (let s = 0; s < shapes.length; s++)
      new_event['positions'][s] = [shapes[s].x, shapes[s].y];
    pushEvent(new_event);
  }
  textSize(18);
  strokeWeight(1); //  
  drawMovingshapes();
  drawLayout();
}
function presentITI_Added() {
  noStroke();
}
function presentITI() {
  noStroke();

  ref_time_OldTrial_Clicking = -1;
}
//******************************For Dragging ****************/
function mousePressed() {
  // Evualate for each shape if it is being dragged
  for (i = 0; i < shapes.length; i++) {
    if (shapes[i].pressed())
      return;
  }
}

function mouseReleased() {
  // Release shapes from being dragged
  for (i = 0; i < shapes.length; i++)
    shapes[i].released();
}
function clickOK() {
  // flip = !flip;
  // signal = 1 - signal; 

  buttonRE.hide();
  buttonOK.hide();

  ref_time_ITI = Date.now();
  parent.console.log("RecordData:07_trial_time");
  parent.console.log("RecordData:07_Probe_start_iti");
  parent.console.log("RecordData:trial_solution");
  parent.console.log("RecordData:trial_result");
  parent.console.log("RecordData:trial_correct");

  task.trial_time[task.trial] = Date.now() - task.trial_start[task.trial];
  task.Probe_start_iti[task.trial] = Date.now();
  task.trial_solution[task.trial] = shapes[shape_submitted]['id'];

  // Add result: which target entries ended up coloured in
  var row_offset = 0;
  var col_offset = 0;
  var n_rows = 0;
  var n_cols = 0;
  var choice_num = 8;
  // Run through rectangles in solution and update offsets and cols
  for (let s = 0; s < shapes[shape_submitted].rectangles.length; s++) {
    var curr_rect = shapes[shape_submitted].rectangles[s];
    row_offset = Math.max(-Math.floor(curr_rect[1] / grid), row_offset);
    col_offset = Math.max(-Math.floor(curr_rect[0] / grid), col_offset);
    n_rows = Math.max(Math.floor(curr_rect[1] / grid), n_rows);
    n_cols = Math.max(Math.floor(curr_rect[0] / grid), n_cols);
  }
  // Add offset to n_rows and n_cols to compensate negative coords
  n_rows = n_rows + row_offset + 1;
  n_cols = n_cols + col_offset + 1;
  // Create empty result matrix
  task.trial_result[task.trial] = []
  for (r = 0; r < n_rows; r++) {
    task.trial_result[task.trial][r] = [];
    for (c = 0; c < n_cols; c++)
      task.trial_result[task.trial][r][c] = 0;
  }
  // Then add all rectangles in result matrix
  for (let s = 0; s < shapes[shape_submitted].rectangles.length; s++) {
    var curr_rect = shapes[shape_submitted].rectangles[s];
    task.trial_result[task.trial][Math.floor(curr_rect[1] / grid) + row_offset][Math.floor(curr_rect[0] / grid) + col_offset] = 1;
  }
  task.trial_correct[task.trial] = resultScore();
  //parent.console.log(task.trial_correct[task.trial] );
  for (let s = 0; s < choice_num; s++)
    shapes[s] = new Draggable(0, 0, []);
  whetherITI = true;
  whetherresetShapes = false;
  
  parent.checkErrorRate();
  console.log("是否打破循环:",window.parent.whetherbreakloop);
  if (window.parent.whetherbreakloop) {
    // 清空选择
    selectedShapes = [];
    clickPositions = [];
    click_finish = false;

    
      flip = !flip;
      signal = 1 - signal;
  
      whetherOldTrial_Clicking_setup = true;
      whetherITI = false;
      task.Probe_time_iti[task.trial] = Date.now() - ref_time_ITI;
      parent.console.log("RecordData:08_Probe_time_iti");
      ref_time_ITI = -1;
      whetherITI = false;
      parent.console.log("task.trial" + task.trial);
      parent.console.log("task.block_Curr" + task.block_Curr);
      var header = parent.document.getElementById('header');
      header.style.visibility = "visible";
      task.trial_Probe += 1;
      parent.store_trial();
      parent.saveData();
      task.block_Curr += 1;
      parent.nextTab();
      console.log("6");
    
  }
}

function clickRE() {
  whetherresetShapes = true;

  const clickInfo = {
    RE_x: (x_target - this.x) / grid,
    RE_y: (y_target - this.y) / grid,
    RE_time:Date.now()
  }

  clickPositions_old.push(clickPositions,
    clickInfo);
  task.mousePositions.push({click_old: clickPositions_old});
  // Create shape objects
  var choice_num = 8;
  for (let s = 0; s < choice_num; s++)
    shapes[s] = new Draggable(0, 0, []);
  selectedShapes = [];
  clickPositions = [];
  initShapes();
  eventReset();
}

function initShapes() {
  console.log("目标索引:",task.trial_target_ids[task.trial]);
  if (!whetherresetShapes) {
    // Clear submission
    shape_submitted = -1;
    // Set starting positions in grid coordinates
    var choice_num = 8;
    var start = [];
    // Calculate offset for each shape based on its index, centered around x_start
    const offset = (choice_num - 0.75) / 2;
    for (let col = 0; col < choice_num; col++) {
      // 以中心为基准排列，并存入 start 数组
      start[col] = [(col - offset) * (grid * 3 / choice_num), block * 0.5 - 1];
    }
    // Randomly shuffle initial positions
    shuffleArray(start);
    task.mousePositions.push(
      { 
      choice_position: start
      });
    

  // 定义矩阵和对应的名称
  var rectanglesss = [
    [[0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 1, 1]], // 左上角
    [[0, 0, 1, 1], [1, 0, 1, 1], [1, 1, 1, 1]], // 右上角
    [[0, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]], // 左下角
    [[1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]], // 右下角
    //[[0, 0, 1, 1]], // 点格
    [[0, 0, 1, 1], [0, 1, 1, 1]], // 短竖
    [[0, 0, 1, 1], [1, 0, 1, 1]], // 短横
    [[0, 0, 1, 1], [0, 1, 1, 1], [0, 2, 1, 1]], // 长竖
    [[0, 0, 1, 1], [1, 0, 1, 1], [2, 0, 1, 1]]  // 长横
  ];

  rectangless = rectanglesss.map(subMatrix =>
    subMatrix.map(row =>
      row.map(value => value * 25)
    )
  );

  // 定义矩阵的名称映射
  var rectangleNames = [
    "左上角", "右上角", "左下角", "右下角",
    "短竖", "短横", "长竖", "长横"
  ];

  // 将名称映射到每个矩阵对象中
  rectangless = rectangless.map((rect, index) => ({
    coordinates: rect,
    name: rectangleNames[index]
  }));

  rectangles = rectangless.map(item => item.coordinates);
  rectangles_name = rectangless.map(item => item.name);
  rectangles_store = rectangles;
  start_store = start;}
  else if (whetherresetShapes) {
    start = start_store;
    rectangles = rectangles_store;
  }

  // Convert rectangle grid coordinates to pixels and add names
  for (let s = 0; s < rectangles.length; s++) {
    for (let r = 0; r < rectangles[s].length; r++) {
      for (let i = 0; i < rectangles[s][r].length; i++) {
        rectangles[s][r][i] *= 1;
      }
    }
  }


  // Run through shapes and update their positions
  for (let s = 0; s < shapes.length; s++) {
    // Set the x and y position based on the offset from the center
    shapes[s].x = x_start + grid * start[s][0];
    shapes[s].x_start = shapes[s].x;
    shapes[s].y = y_start + grid * start[s][1];
    shapes[s].y_start = shapes[s].y;
  }

  // Run through shapes and set rectangles with names
  for (let s = 0; s < shapes.length; s++) {
    shapes[s].rectangles = rectangles[s];
  }

  // Set shape ids: all primitives in this shape and their offsets
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].id = [{ 'id': i, 'x': 0, 'y': 0 }];
  }
}

function finishTrial() {
  ref_time_ITI = -1;
  whetherITI = false;
  if (task.trial < (task.n_trials - 1)) {
    parent.console.log("task.trial" + task.trial);
    whetherInstru = true;
    initTrial();
  }
  else {
    parent.console.log("task.trial" + task.trial);
    parent.console.log("task.block_Curr" + task.block_Curr);
    var header = parent.document.getElementById('header');
    header.style.visibility = "visible";
    task.trial_Probe += 1;
    parent.store_trial();
    parent.saveData();
    task.block_Curr += 1;
    parent.nextTab();
  }
}
function hideShapes_element() {
  // Run through shapes and update their position to somewhere off the screen
  for (let s = 0; s < shapes.length; s++) {
    shapes[s].x = -999;
    shapes[s].x_start = -999;
    shapes[s].y = -999;
    shapes[s].y_start = -999;
  }
}
//****************************Other function************* */

function pushEvent(new_event) {
  // Add event to list
  parent.console.log("RecordData:pushEvent");

  task.trial_events[task.trial].push(new_event);
  // Flip the signal pixel for synchronisation
  flip = !flip;
  signal = 1 - signal;

}
function eventReset() {
  // Indicate as event where each object ended up
  var new_event = {
    'type': 'Probe_Reset',
    'time': Date.now() - task.trial_start[task.trial],
    'positions': []
  };
  // Add all shape positions to list
  for (let s = 0; s < shapes.length; s++)
    new_event['positions'][s] = [shapes[s].x, shapes[s].y];
  // Add event to list
  pushEvent(new_event);
  //task.trial_events[task.trial].push(new_event);  
}

function nameMatrix(matrix) {
  // 定义映射关系：每个数字对应的矩阵名称
  const nameMapping = {
    1: "左上角",
    2: "右上角",
    3: "左下角",
    4: "右下角",
    5: "点格",
    6: "短竖",
    7: "短横",
    8: "长竖",
    9: "长横"
  };

  // 创建一个集合来存储唯一的名称
  const names = new Set();

  // 如果传入的是单个矩阵（即一维数组）
  if (Array.isArray(matrix[0])) {
    // 如果是二维数组（矩阵组合），遍历所有矩阵
    for (let row of matrix) {
      for (let value of row) {
        if (nameMapping[value]) {
          names.add(nameMapping[value]);  // 添加名称到集合中
        }
      }
    }
  } else {
    // 如果是一个矩阵数组（单个矩阵），直接处理
    for (let value of matrix) {
      if (nameMapping[value]) {
        names.add(nameMapping[value]);  // 添加名称到集合中
      }
    }
  }

  // 将集合转换为数组并返回所有找到的名称
  return names.size > 0 ? Array.from(names) : ["未定义"];
}

function submitChoices1(target) {
  // 获取目标矩阵的名称
  var target_answer = nameMatrix(target);
  console.log("目标矩阵名称:", target_answer);

  if (task.block_Curr <= 6) {
    correctChoiceCount = 2; // 如果block_Curr小于等于6，选择2个正确答案
  } else {
    correctChoiceCount = 3; // 如果block_Curr大于6，选择3个正确答案
  }

  // 获取选择矩阵的名称
  const lastSelectedLabels = clickedChoices.slice(-correctChoiceCount); // 获取最后选中的正确数量标签
  var choice_name = nameMatrix(lastSelectedLabels);
  console.log("选择的矩阵名称:", choice_name);
  


  // 将目标矩阵和选择矩阵名称转换为集合，以便检查是否包含
  var target_set = new Set(target_answer);
  var choice_set = new Set(choice_name);

  // 判断选择的矩阵名称是否包含目标矩阵名称中的所有项
  let isCorrect = [...target_set].every(item => choice_set.has(item));
  console.log("是否包含目标名称中的所有项:", isCorrect);

  // 重置点击选择
  clickedChoices = [];

  // 如果包含所有目标名称的项则算正确
  if (isCorrect) {
    console.log("正确选择!");
    return 1;  // 正确答案
  } else {
    console.log("错误选择!");
    return 0;  // 错误答案
  }
}

function resultScore() {
  // 计算分数：调用 submitChoices1 并接收返回值
  const score = submitChoices1(target);
  return score;  // 返回最终得分
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
function drawMovingshapes() {
  // 绘制横线
  for (i = 0; i < shapes.length; i++) {
    shapes[i].over();
    shapes[i].update();
    shapes[i].show();
    //console.log({大小:shapes.length});
  }
}
function drawLayout() {
  // Draw submission line
  stroke(0);
  line(100, canvas_h / 2, canvas_w - 100, canvas_h / 2);
  // Draw instruction text
  noStroke();
  fill(0);
  textSize(18);
}


function presentMarker() {
  // Draw signal pixel for given value
  noStroke();
  fill(signal * 255);
  rect(0, 0, button_height * 2.5, button_height * 2.5);
  rect(canvas_w - button_height * 2.5, 0, button_height * 2.5, button_height * 2.5);

}

function drawtarget(target, grid_2, y_start) {
  x_target = grid_2 * (Math.round((canvas_w - target[0].length * grid_2) * 0.5 / grid_2));
  y_target = y_start - (target.length + 2) * grid_2;
  //console.log({大小:target.length});
  noStroke();

  var start_X = 0;
  var start_Y = 0;
  var End_X = 0;
  var End_Y = 0;
  var row = 0;
  var column = 0;
  for (r = 0; r < target.length; r++) {
    for (c = 0; c < target[r].length; c++) {
      fill((1 - target[r][c]) * 255);
      stroke(255);
      //grid_2 = grid_2*2;
      rect(x_target + c * grid_2, y_target + r * grid_2, grid_2, grid_2);

      if (r == 0 && c == 0) {
        start_X = x_target + c * grid_2 + 2;
        start_Y = y_target + r * grid_2 + 2;

      }
      if (r == (target.length - 1) && c == (target[r].length - 1)) {
        End_X = x_target + c * grid_2 + grid_2 - 2;
        End_Y = y_target + r * grid_2 + grid_2 - 2;
        row = r + 1;
        column = c + 1;
      }
    }
  }
  if (wtsaveBigCompData) {
    task.Trace_BigCompLoc[task.trial] = [row, column, start_X, start_Y, End_X - start_X, End_Y - start_Y];
    parent.console.log('RecordData:05_Trace_BigCompLoc');
    wtsaveBigCompData = false;
  }

}

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {


    for (let m = 0; m < arr1[i].length; m++) {
      if (arr1[i][m] !== arr2[i][m]) {
        return false;
      }
    }

  }
  return true;
}

function buttonPosition(buttonName, x, y, z, k, color, mousePressedCallback) {
  buttonName.position(x, y);
  buttonName.size(z, k);
  buttonName.style('color', color);
  buttonName.style('font-size', '18px');
  buttonName.mousePressed(mousePressedCallback);

}

function clickSU() {
  const SUInfo = {
    SU_x: (x_target - this.x) / grid,
    SU_y: (y_target - this.y) / grid,
    SU_time: Date.now(),
  }
  console.log("点击次数:",clickPositions);
  if (task.block_Curr <= 6) {
    if (clickPositions.length == 2) {
      click_finish = true;
      task.mousePositions.push({click: clickPositions});
      task.mousePositions.push(SUInfo);
      parent.saveMouseData();
    } else {click_finish = false}
  } else {
    if (clickPositions.length == 3) {
      click_finish = true;
      task.mousePositions.push({click: clickPositions});
      task.mousePositions.push(SUInfo);
      parent.saveMouseData();
    } else {click_finish = false}
  }
}

class Draggable {
  constructor(x, y, rectangles) {
    // State variables
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the object?
    this.returning = false; // It the object moving back after invalid move?
    this.submit = false;
    this.id = [];
    this.x = x;
    this.y = y;
    this.x_start = x;
    this.y_start = y;
    // Keep track of actions involving object
    this.event = {};
    // Layout setup: grid for aligning to
    this.grid = grid;
    // Component rectangles: collection of rectangles [x, y, w, h]
    this.rectangles = rectangles;
  }

  on_shape(x, y) {
    // Return if input x,y position is somewhere on this shape
    var is_on = false;
    for (let s = 0; s < this.rectangles.length; s++) {
      var curr_rect = this.rectangles[s];
      if (x > this.x + curr_rect[0] && x < this.x + curr_rect[0] + curr_rect[2] &&
        y > this.y + curr_rect[1] && y < this.y + curr_rect[1] + curr_rect[3])
        is_on = true;
    }
    // But only if the task has actually started, and not currently moving back
    return (Object.keys(task).length > 0) && is_on && !this.returning
  }
  do_overlap_inclusive(rect1, rect2) {
    // Return if these two rectangles [x, y, w, h] overlap *including* boundaries
    // But do this separately for horizontal and vertical overlap to exclude corners
    return ((rect1[0] <= (rect2[0] + rect2[2]) && rect2[0] <= (rect1[0] + rect1[2])
      && rect1[1] < (rect2[1] + rect2[3]) && rect2[1] < (rect1[1] + rect1[3])) ||
      (rect1[0] < (rect2[0] + rect2[2]) && rect2[0] < (rect1[0] + rect1[2])
        && rect1[1] <= (rect2[1] + rect2[3]) && rect2[1] <= (rect1[1] + rect1[3])))

  }
  do_overlap_exclusive(rect1, rect2) {
    // Return if these two rectangles [x, y, w, h] overlap *excluding* boundaries
    return (rect1[0] < (rect2[0] + rect2[2]) && rect2[0] < (rect1[0] + rect1[2])
      && rect1[1] < (rect2[1] + rect2[3]) && rect2[1] < (rect1[1] + rect1[3]))
  }
  over() {
    if (this.on_shape(mouseX, mouseY)) {
      this.rollover = true;
    } else {
      this.rollover = false;

    }

  }

  update() {
    if (this.returning) {
      // If close to home: snap to start, and stop returning
      if (Math.abs(this.x - this.x_start) < grid && Math.abs(this.y - this.y_start) < grid) {
        this.x = this.x_start;
        this.y = this.y_start;
        this.returning = false;
      }
      else {
        // Move 10% towards home 
        this.x += (this.x_start - this.x) * 0.1;
        this.y += (this.y_start - this.y) * 0.1;
      }
    }
    if (this.dragging) {
      //this.x = Math.max(-grid * 3, Math.min(mouseX + this.offsetX, canvas_w + 3 * grid));
      //this.y = Math.max(grid * 14, Math.min(mouseY + this.offsetY, canvas_h - grid * 0.25));
    }
    if (task.block_Curr <= 6)
      {
      if (clickPositions.length >= 2) 
        {
        buttonOK.show();
        }
      } else {
        if (clickPositions.length >= 3) 
          {
          buttonOK.show();
          }
      }
  }

  show() {
    stroke(255);
    // Different fill based on state
    if (this.dragging) {
      fill(0, 138, 0);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175);
    }
    for (let s = 0; s < this.rectangles.length; s++)
      rect(this.x + this.rectangles[s][0], this.y + this.rectangles[s][1],
        this.rectangles[s][2], this.rectangles[s][3]);
  }


  pressed() {
    // Dragging is allows if a) no submission, or b) submission is this object
    // Notice this if condition only works because of javascript short circuiting
    if (shape_submitted == -1 || shapes[shape_submitted] === this) {
      // Did I click on the rectangle?
      if (this.on_shape(mouseX, mouseY)) {

        /*  if (!selectedShapes.includes(this)) { // 检查是否已选择
           selectedShapes.push(this); // 添加当前形状到选择中
           let relativePosition = {
             index: clickPositions.length + 1, // 添加点击索引
             x: (x_target - this.x) / grid,
             y: (y_target - this.y) / grid
           };
           clickPositions.push(relativePosition); // 记录点击位置
         } */

        // Push mouse pressed event
        for (let c = 0; c < this.id.length; c++) {
          let id = this.id[c]['id']
          let x = this.id[c]['x']
          let y = this.id[c]['y']
          let all = { id: id, x: x, y: y }
        }
        pushEvent({
          'type': 'Probe_Press',
          'id': this.id,
          'time': Date.now() - task.trial_start[task.trial]
        });

        // 将当前的 choice_id 存入全局数组
        if (this.id[0].id < 4)
          {
            clickedChoices.push(this.id[0].id + 1);
          } else if(this.id[0].id >= 4){
            clickedChoices.push(this.id[0].id + 2);
          }
        console.log("Current clickedChoices:", clickedChoices);

        // And start dragging
        this.dragging = true;

        // If so, keep track of relative location of click to corner of rectangle
        this.offsetX = this.x - mouseX;
        this.offsetY = this.y - mouseY;

        // Initialise Last move event
        this.event = {
          'type': 'Probe_End',
          'id': this.id,
          'time': Date.now() - task.trial_start[task.trial],
        };

        // 更新task.trial_solution以记录当前按下的形状
        task.trial_solution[task.trial] = this.id;

        // Return true. This makes sure you can't select two shapes simultaneously
        return true;
      }
      else
        return false;
    }
    else
      return false;
  }

  submitChoices() {
    if (clickedChoices.length >= 2) { // 确保至少有两个 choice_id
      resultScore(clickedChoices); // 调用 resultScore 函数
      clickedChoices = []; // 重置数组以备下次使用
    } else {
      console.log("请先点击两个形状");
    }
  }


  released() {
    if (this.dragging) {
      // Map to nearest multiple of grid (this line can be kept if necessary)
      // this.x = this.grid * (Math.round(this.x / this.grid));
      // this.y = this.grid * (Math.round(this.y / this.grid));
      // 添加当前形状到选择
      if (!selectedShapes.includes(this)) {
        selectedShapes.push(this);
        let relativePosition = {
          //choiceID: selectedIndices,
          //choicePosition: start,
          click_ID: clickedChoices.length, // 添加点击索引
          click_choice_now: this.id[0].id,
          click_choice_all: clickedChoices,
          click_x: (x_target - this.x) / grid,
          click_y: (y_target - this.y) / grid,
          click_time: Date.now(),
        };
        clickPositions.push(relativePosition); // 记录点击位置
      }

      //buttonOK.show();

      if (click_finish) {
        for (let s = 0; s < shapes.length; s++) {
          if (shapes[s] === this) {
            shape_submitted = s;
          } else {
            // 其他形状可以移除
            shapes[s].x = 0;
            shapes[s].y = 0;
            shapes[s].rectangles = [];
          }
        }

        // 设置新位置为起始位置
        this.x_start = this.x;
        this.y_start = this.y;

        // 记录提交事件
        this.event.submit = {
          'time': Date.now() - task.trial_start[task.trial] - this.event.time,
          'self': this.id,
          'clicks': clickPositions, // 存储所有点击相对位置
        };
        pushEvent(this.event);

        whetherOldTrial_Clicking = false;

        clickOK(); // 提交操作

        // 清空选择
        selectedShapes = [];
        clickPositions = [];
        clickPositions_old = [];
        click_finish = false;
      }

    }
  }
}
