const DEFINE_STAR_STYLE = [ '<span> &nbsp; </span>',
                            '<span class="white-star">★</span>',
                            '<span class="black-star">★</span>',
                            '<span class="red-star">★</span>',
                            '<span class="green-star">★</span>',
                            '<span class="blue-star">★</span>',
                            '<span class="yellow-star">★</span>',
                            '<span class="purple-star">★</span>' ];

const DEFINE_CHARA_NAME = [ '',
                            '艾伯李斯特','艾依查庫','古魯瓦爾多','阿貝爾','利恩','庫勒尼西','傑多','阿奇波爾多','馬庫斯','布列依斯',
                            '雪莉','艾茵','伯恩哈德','弗雷特里西','瑪格莉特','多妮妲','史普拉多','貝琳達','羅索','艾妲',
                            '梅倫','薩爾卡多','蕾格烈芙','里斯','米利安','沃肯','佛羅倫斯','帕茉','阿修羅','布朗寧',
                            '瑪爾瑟斯','路德','魯卡','史塔夏','沃蘭德','C.C.','柯布','伊芙琳','布勞','凱倫貝克',
                            '音音夢','康拉德','碧姬媞','庫恩','夏洛特','泰瑞爾','露緹亞','威廉','梅莉','古斯塔夫',
                            '尤莉卡','林奈烏斯','娜汀','迪諾','奧蘭(棕)','奧蘭(黑白)','諾伊庫洛姆','出葉','希拉莉','克洛維斯',
                            '艾莉絲泰莉雅','雨果','艾莉亞娜','格雷高爾','蕾塔','伊普西隆','波蕾特','尤哈尼','諾艾菈','勞爾',
                            '潔米','瑟法斯','維若妮卡','里卡多','瑪麗妮菈','摩根','茱蒂絲'
                        ];

const CHARA_MIN_COST=8;
const CHARA_MAX_COST=38;

let minGap = 0;
let charaFilterList = [];

let charaFilterMenu = document.getElementById("chara-filter-menu");
let charaList = document.getElementById("chara-list");
let banUnitList = document.getElementById("ban-unit-list");
let $minCostSlider = document.getElementById('min-cost');
let $maxCostSlider = document.getElementById('max-cost');
let $minCostInputArea = document.getElementById('input-min-cost');
let $maxCostInputArea = document.getElementById('input-max-cost');
let $resultList = document.getElementById('result-list');
let $searchBtn = document.getElementById('search-btn');
let showCostBtn = document.getElementById('show-cost');
let showSlotBtn = document.getElementById('show-slot');
let unpublishedCharaBtn = document.getElementById('unpublished-chara');
let orderBtn = document.getElementById('order');

let $cardData = [];
let $showData = [];

function scrollHorizontally(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('ban-unit-list').scrollLeft -= (delta * 24); // Multiplied by 40
    e.preventDefault();
}

function openCharaFilterMenu(){
    if (charaFilterMenu.classList.contains("hidden")) {
        charaFilterMenu.classList.remove("hidden");
    } else {
        closeCharaFilterMenu();
    }
}

function closeCharaFilterMenu(){
    charaFilterMenu.classList.add("hidden");
    submitCharaFilterList();
}

function resetCharaFilterCheckbox(){
    let allCharaFilterCheckboxClass = [].slice.call(document.getElementsByName("ban"));
    allCharaFilterCheckboxClass.forEach( function(elem) {
        elem.checked = false;
    });
}

function renderCharaFilterMenu(){
    let str ='';
    for(i=1;i<78;i++){
        str += `<li class="chara-face">
                    <label><input type="checkbox" name="ban" value="${i}"><img src="./img/face/ch${i.toString().padStart(2,"0")}_f.png">
                    <div class="chara-face-name">${DEFINE_CHARA_NAME[i]}</div></label>
                </li>`;
    }
    str += `<li class="ghost-face"></li><li class="ghost-face"></li><li class="ghost-face"></li><li class="ghost-face"></li>
            <li class="ghost-face"></li><li class="ghost-face"></li><li class="ghost-face"></li>`
    charaList.innerHTML=str;
}

function submitCharaFilterList() {
    let str = '';
    charaFilterList.splice(0,charaFilterList.length);
    let checkedBanBox = [].slice.call(document.querySelectorAll('input[name=ban]:checked'));
    checkedBanBox.forEach( function (i) {
        str += `<img src="img/unit/ch${i.value.padStart(2,"0")}_unit.png" title="${DEFINE_CHARA_NAME[parseInt(i.value)]}">`; 
        charaFilterList.push(parseInt(i.value));
    });
    banUnitList.innerHTML = str;
}

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
        let slotFilterList = document.getElementById("slot-filter-list");
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
        $maxCostSlider.value = parseInt($minCostSlider.value) - minGap;
    }
    $minCostInputArea.value = $minCostSlider.value;
    $maxCostInputArea.value = $maxCostSlider.value;
}

function slideMax(){
    if (parseInt($maxCostSlider.value) - parseInt($minCostSlider.value) <= minGap) {
        $minCostSlider.value = parseInt($maxCostSlider.value) - minGap;
    }
    $maxCostInputArea.value = $maxCostSlider.value;
    $minCostInputArea.value = $minCostSlider.value;
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

function showCardCost(){
    let allCharaCostClass = [].slice.call(document.getElementsByClassName("chara-cost"));
    allCharaCostClass.forEach( function(elem) {
        elem.classList.remove("hidden");
    });
    let allCharaSlotClass = [].slice.call(document.getElementsByClassName("chara-slot"));
    allCharaSlotClass.forEach( function(elem) {
        elem.classList.add("hidden");
    });
}

function showCardSlot(){
    let allCharaCostClass = [].slice.call(document.getElementsByClassName("chara-cost"));
    allCharaCostClass.forEach( function(elem) {
        elem.classList.add("hidden");
    });
    let allCharaSlotClass = [].slice.call(document.getElementsByClassName("chara-slot"));
    allCharaSlotClass.forEach( function(elem) {
        elem.classList.remove("hidden");
    });
}

function doSearch(){
    $showData.splice(0,$showData.length);
    $searchBtn.disabled =true;
    let levelFilterList = [];
    let checkedLevelBox = [].slice.call(document.querySelectorAll('input[name=level]:checked'))
    checkedLevelBox.forEach( function (i) { levelFilterList.push(i.value); } );

    let minCostValue = parseInt($minCostSlider.value);
    let maxCostValue = parseInt($maxCostSlider.value);

    let slotFilterList = [];
    let slotFilterArray = [].slice.call(document.querySelectorAll('.btn-change-slot'));
    slotFilterArray.forEach( function (i) { slotFilterList.push(i.value); } );
    slotFilterList.sort();

    let p_filter = 0,p_data = 0;
    $cardData.forEach( function (data) {
        if (!(data.available || unpublishedCharaBtn.checked))  { return; };
        if (charaFilterList.includes(data.charaId)) { return; };
        if (!levelFilterList.includes(data.level))  { return; };
        if (data.cost < minCostValue || data.cost > maxCostValue ) { return; };
        if (slotFilterList.length == 0) { $showData.push(data); return; }
        if (data.slotColor.length >= slotFilterList.length) {
            p_filter = 0,p_data = 0;
            do {
                if (slotFilterList[p_filter] == data.slotColor[p_data]){
                    p_filter++,p_data++;
                } else {
                    p_data++;
                }
            } while(p_filter<slotFilterList.length && p_data<data.slotColor.length);
            if (p_filter == slotFilterList.length) { $showData.push(data); }
        };
    });
    let tag = document.querySelector('input[name=sort]:checked');
    let order = orderBtn.checked? 1 : -1;
    render( doSort($showData, tag.value, order), tag.value);
    $searchBtn.disabled =false;
};

function doSort(data,sort,order){
    let mappedData;
    switch (sort){
        case 'cost':
            mappedData = data.map( function(elem,i) {
                return { index: i, value: elem.cost }
            })
            break;
        case 'chara':
            mappedData = data.map( function(elem,i) {
                return { index: i, value: elem.charaId }
            })
            break;
        case 'level':
            mappedData = data.map( function(elem,i) {
                return { index: i, value: elem.levelNum }
            })
            break;
        
    }
    mappedData.sort( function(a,b){
        return (a.value - b.value)*order;
    })
    
    return mappedData.map( function(elem) {
        return data[elem.index]
    })
}

function render(sortedResultData, sort) {
    let str = '<div><ul class="ghost-tag" id="tag-list">';
    let slotInfoClassStr = '';
    let costInfoClassStr = '';
    let cardSlotStr = '';
    let previousTag = undefined;
    
    sortedResultData.forEach( function (data) {
        if (data.cardId <= 0) { return; }

            switch (sort) {
                case 'cost' :
                    if (data.cost != previousTag) {
                        previousTag = data.cost;
                        str += `</ul></div>
                                <div class="tag"><p class="tag-name">Cost:${data.cost}</p>
                                <ul class="tag-list" id="tag-list">`;
                        }
                break;
                case 'chara' :
                    if (data.charaId != previousTag) {
                        previousTag = data.charaId;
                        str += `</ul></div>
                                <div class="tag"><p class="tag-name">${data.charaName}</p>
                                <ul class="tag-list" id="tag-list">`;
                    }
                    break;
                case 'level' :
                    if (data.levelNum != previousTag) {
                        previousTag = data.levelNum;
                        str += `</ul></div>
                                <div class="tag"><p class="tag-name">${data.level}</p>
                                <ul class="tag-list" id="tag-list">`;
                    }
                    break;
            }
            
            data.slotColor.forEach( function (slot) {
                cardSlotStr = DEFINE_STAR_STYLE[slot] + cardSlotStr;
            });

            if (showCostBtn.checked) { slotInfoClassStr = 'hidden'; }
            if (showSlotBtn.checked) { costInfoClassStr = 'hidden'; }

            str += `
                    <li class="card-id${data.cardId}">
                        <p class="chara-level">${data.level}</p>
                        <img id="card-frame${data.cardId%10}" src="./img/${data.imageName}.png" alt="${data.charaName}">
                        <div class="chara-slot ${slotInfoClassStr}">${cardSlotStr}</div>
                        <div class="chara-cost ${costInfoClassStr}">${data.cost}</div>
                    </li>
                    `;
            slotInfoClassStr = '';
            cardSlotStr = '';
        }
    );

    str += `</ul></div>`;
    
    $resultList.innerHTML = str;
}

function initialRender(result) {
    let str = '<div><ul class="ghost-tag">';
    let tempSlotStr = '';
    let previousTag = undefined;
    result.forEach( function (data) {
            if (data.cardId <= 0) { return; }

            if(data.charaId != previousTag) {
                previousTag = data.charaId;
                str += `</ul></div>
                        <div class="tag"><p class="tag-name">${data.charaName}</p>
                        <ul class="tag-list" id="tag-list">`;
            }

            data.slotColor.forEach( function (slot) {
                tempSlotStr = DEFINE_STAR_STYLE[slot] + tempSlotStr;
            });
            str += `
                    <li class="card-id${data.cardId}">
                        <p class="chara-level">${data.level}</p>
                        <img id="card-frame${data.cardId%10}" src="./img/${data.imageName}.png" alt="${data.charaName}">
                        <div class="chara-slot">${tempSlotStr}</div>
                        <div class="chara-cost hidden">${data.cost}</div>
                    </li>
                `;
            tempSlotStr = '';
        }
    );
    str += `</ul></div>`;
    $resultList.innerHTML = str;
};

(function(){
    const REQUESTURL = 'https://raw.githubusercontent.com/groovad/groovad.github.io/gh-pages/data/characard.json';

    const resultListPanel = function(data){
        $cardData = data;
        initialRender(data);
        renderCharaFilterMenu();
    }

    fetch(REQUESTURL, { mode: 'cors'})
    .then(res => res.json())
    .then(json => resultListPanel(json))
})();
