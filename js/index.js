const DEFINE_STAR_STYLE = [ '<span> &nbsp; </span>',
                            '<span class="white-star">★</span>',
                            '<span class="black-star">★</span>',
                            '<span class="red-star">★</span>',
                            '<span class="green-star">★</span>',
                            '<span class="blue-star">★</span>',
                            '<span class="yellow-star">★</span>',
                            '<span class="purple-star">★</span>' ];

const CHARA_MIN_COST=8;
const CHARA_MAX_COST=38;

let $minCostSlider = document.getElementById('min-cost');
let $maxCostSlider = document.getElementById('max-cost');
let $minCostInputArea = document.getElementById('input-min-cost');
let $maxCostInputArea = document.getElementById('input-max-cost');
let minGap = 0;
let $resultList = document.getElementById('result-list');
let $searchBtn = document.getElementById('search-btn');

let $cardData = [];
let $showData = [];

function changeSlotColor() {
    let nowColorNum = parseInt(this.value)
    let nextColorNum = nowColorNum == 7 ? 1 : nowColorNum+1 ;
    this.value = nextColorNum;
    this.innerHTML = `<img src="./img/star${nextColorNum}.png">`;
}

function deleteLastSlotFilterList() {
    let count = document.querySelectorAll(".btn-change-slot").length;
    if (count > 0) {
        let removeTarget = document.getElementById(`slot-${count}`);
        removeTarget.remove();
    }
}

function addToSlotFilterList() {
    let count = document.querySelectorAll(".btn-change-slot").length;
    if (count < 6) {
        let slotFilterList = document.querySelector(".slot-filter-list");
        let newSlotItem = document.createElement("li");
        newSlotItem.classList.add("btn-change-slot");
        newSlotItem.setAttribute("id",`slot-${count+1}`)
        newSlotItem.setAttribute("value",1);
        newSlotItem.setAttribute("onclick","changeSlotColor.call(this)");
        newSlotItem.innerHTML = '<img src="./img/star1.png">';
        slotFilterList.appendChild(newSlotItem);
    }
}

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
        $minCostInputArea.value = CHARA_MIN_COST;
        $minCostSlider.value = CHARA_MIN_COST;
    } else {
        $minCostSlider.value = parseInt($minCostInputArea.value);
    }
}

function inputMax() {
    if (parseInt($maxCostInputArea.value) - parseInt($minCostInputArea.value) < minGap || parseInt($maxCostInputArea.value) > 50){
        alert('請輸入大於最小值的數字或超出範圍')
        $maxCostInputArea.value = CHARA_MAX_COST;
        $maxCostSlider.value = CHARA_MAX_COST;
    } else {
        $maxCostSlider.value = parseInt($maxCostInputArea.value);
    }
}

$searchBtn.addEventListener('click',doSearch);

function doSearch(){
    $showData = [];

    let checkedLevels = [];
    let checkedLevelBox = [].slice.call(document.querySelectorAll('input[name=level]:checked'))
    checkedLevelBox.forEach( function (i) { checkedLevels.push(i.value); } );

    let minCostValue = parseInt($minCostSlider.value);
    let maxCostValue = parseInt($maxCostSlider.value);

    let slotFilterList = [];
    let slotFilterArray = [].slice.call(document.querySelectorAll('.btn-change-slot'));
    slotFilterArray.forEach( function (i) { slotFilterList.push(i.value); } );
    slotFilterList.sort();

    $cardData.forEach( function (data) {
        if (data.cost >=minCostValue && data.cost <=maxCostValue && checkedLevels.includes(data.level)){
            if (data.slotColor.length >= slotFilterList.length) {
                let copiedList = Array.from(slotFilterList);
                data.slotColor.forEach( function(color) {
                    if (copiedList.includes(color)) {
                        copiedList.shift();
                    }
                })
                if (copiedList.length == 0) { $showData.push(data); }
            } else if (slotFilterList.length == 0) {
                $showData.push(data);
            }
        }
    });
    render($showData);
};

function render(result) {
    let str = '';
    let tempSlotStr = '';
    result.forEach( function (data) {
        if (data.cardId > 0) {
            data.slotColor.forEach( function (slot) {
                tempSlotStr = DEFINE_STAR_STYLE[slot] + tempSlotStr;
            });
            str += `
                <li class="card-id${data.cardId}">
                    <p class="chara-level">${data.level}</p>
                    <img id="card-frame${data.cardId%10}" src="./img/${data.imageName}.png" alt="${data.charaName}">
                    <div class="chara-slot">${tempSlotStr}</div>
                </li>
            `;
            tempSlotStr = '';
        }
    });
    $resultList.innerHTML = str;
};

(function(){
    const REQUESTURL = './data/characardData.json';

    const resultListPanel = function(data){
        $cardData = data;
        render(data);
    }

    fetch(REQUESTURL, { mode: 'cors'})
    .then(res => res.json())
    .then(json => resultListPanel(json))
})();
