const DEFINE_STAR_STYLE = [ '<span> &nbsp; </span>',
                            '<span id="white-star">★</span>',
                            '<span id="black-star">★</span>',
                            '<span id="red-star">★</span>',
                            '<span id="green-star">★</span>',
                            '<span id="blue-star">★</span>',
                            '<span id="yellow-star">★</span>',
                            '<span id="purple-star">★</span>' ];

let $minCostSlider = document.getElementById('min-cost');
let $maxCostSlider = document.getElementById('max-cost');
let $minCostInputArea = document.getElementById('input-min-cost');
let $maxCostInputArea = document.getElementById('input-max-cost');
let minGap = 0;
let $resultList = document.getElementById('result-list');
let $searchBtn = document.getElementById('search-btn');

let $cardData = [];
let $showData = [];

function slideMin(){
    if (parseInt($minCostSlider.value) - parseInt($maxCostSlider.value) >= minGap) {
        $minCostSlider.value = parseInt($maxCostSlider.value) - minGap;
    }
    $minCostInputArea.value = $minCostSlider.value;
}

function slideMax(){
    if (parseInt($maxCostSlider.value) - parseInt($minCostSlider.value) <= minGap) {
        $maxCostSlider.value = parseInt($minCostSlider.value) - minGap;
    }
    $maxCostInputArea.value = $maxCostSlider.value;
}

function inputMin() {
    if (parseInt($minCostInputArea.value) - parseInt($maxCostInputArea.value) > minGap || parseInt($minCostInputArea.value) < 1){
        alert('請輸入小於最大值的數字或超出範圍')
        $minCostInputArea.value = 1;
        $minCostSlider.value = 1;
    } else {
        $minCostSlider.value = parseInt($minCostInputArea.value);
    }
}

function inputMax() {
    if (parseInt($maxCostInputArea.value) - parseInt($minCostInputArea.value) < minGap || parseInt($maxCostInputArea.value) > 50){
        alert('請輸入大於最小值的數字或超出範圍')
        $maxCostInputArea.value = 50;
        $maxCostSlider.value = 50;
    } else {
        $maxCostSlider.value = parseInt($maxCostInputArea.value);
    }
}

$searchBtn.addEventListener('click',doSearch);

function doSearch(){
    $showData = [];
    let minCostValue = parseInt($minCostSlider.value);
    let maxCostValue = parseInt($maxCostSlider.value);
    for(i = 1; i < $cardData.length; i++){
        if ($cardData[i].cost >=minCostValue && $cardData[i].cost <=maxCostValue){
            $showData.push($cardData[i]);
        }
    }
    render($showData);
};

function render(data) {
    let str = '';
    let tempSlotStr = '';
    for(i = 1; i < data.length; i++) {
        if (data[i].cardId > 0) {
            for(j = 0; j < data[i].slotColor.length; j++){
                tempSlotStr = DEFINE_STAR_STYLE[data[i].slotColor[j]] + tempSlotStr;
            }
            str += `
                    <li id="chara-id">
                        <p id="chara-level">${data[i].level}</p>
                        <img id="card-frame${data[i].cardId%10}" src="./img/${data[i].imageName}.png" alt="${data[i].charaName}">
                        <div id="chara-slot">${tempSlotStr}</div>
                    </li>
                    `;
            tempSlotStr = '';
        }
    };
    $resultList.innerHTML = str;
};

(function(){
    const REQUESTURL = 'https://raw.githubusercontent.com/groovad/groovad.github.io/gh-pages/data/characard.json';

    const resultListPanel = function(data){
        $cardData = data;
        render(data);
    }

    fetch(REQUESTURL, { mode: 'cors'})
    .then(res => res.json())
    .then(json => resultListPanel(json))
})();
