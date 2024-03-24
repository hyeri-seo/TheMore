import { Socket } from '../js/socket/socket.js';

class Quote {
    constructor() {
        this.quote = document.querySelector('#quote');
        this.quotes = [
            '"한 푼 아낀 것은 한 푼 <br> 번 것이나 마찬가지다." <br> <br> - 벤자민 프랭클린',
            '"버는 것보다 적게 쓰는 것을 안다면 <br> 현자의 돌을 가진 것과 같다." <br> <br> - 벤자민 프랭클린',
            '"절약하지 않는 자는 <br> 고뇌하게 될 것이다." <br> <br> - 공자',
            '"돈 생각을 떨쳐내는 유일한 <br> 방법은 돈을 많이 갖는 것이다." <br> <br> - 이디스 워튼',
            '"가난에 대한 두려움이 삶을 <br> 지배하도록 내버려두면, <br> 그 대가로 당신은 먹기는 할 것이나 <br> 살지는 못할 것이다." <br> <br> - 조지 버나드쇼',
            '"돈에 대해 쉽게 사는 방법은 <br> 생활수준을 형편보다 <br> 한 단계 낮추는 것이다." <br> <br> - 헨리 테일러 경',
            '"돈이 전부는 아니지만, <br> 그만한 게 없다." <br> <br> - 메이웨더',
            '"돈지갑의 밑바닥이 드러났을 때의 <br> 절약은 이미 늦은 행위다." <br> <br> - 세네카',
            '"검약은 멋진 수입이다." <br> <br> - 에라스무스',
            '"근면은 부유의 오른손이요, 절약은 그 왼손이다." <br> <br> - J.레이',
        ];

        this.updateQuote();
    }
    updateQuote() {
        const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        this.quote.innerHTML = randomQuote;
    }
}

class Calendar {
    constructor(socket, expensesBox) {
        this.socket = socket;

        this.quote = new Quote();
        this.expensesBox = expensesBox;

        this.calendar = document.querySelector('.calendar');

        this.calendarHeaderYear = document.querySelector('#year');
        this.calendarBodyMonth = document.querySelector('#month');
        this.calendarDays = document.querySelector('.calendar-days');

        this.allDays = document.querySelectorAll('.calendar-days div');

        this.todayShowTime = document.querySelector('.time-formate');
        this.todayShowDate = document.querySelector('.date-formate');
        this.selectedDate = document.querySelector('#selectedDate'); // expensesBox 날짜(일)
        this.select = document.querySelector('#select'); // expenseAdd 날짜(연도-월-일)

        /* 현재 날짜 설정 */
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.currentWeek = this.currentDate.getDay(); //-----expenseBox에 나오게 하고 싶어서 일단 선언함(구현 안함)

        /* 캘린더 생성 */
        this.generateCalendar(this.currentMonth, this.currentYear);

        document.querySelector('#pre-year').addEventListener('click', this.prevYear.bind(this));
        document.querySelector('#next-year').addEventListener('click', this.nextYear.bind(this));
        document.querySelector('#pre-month').addEventListener('click', this.prevMonth.bind(this));
        document.querySelector('#next-month').addEventListener('click', this.nextMonth.bind(this));

        this.calendarDays.addEventListener('click', this.handleDateClick.bind(this));
    }

    prevYear() {
        // 이전 년도로 이동
        this.currentYear--;
        this.generateCalendar(this.currentMonth, this.currentYear);
    }

    nextYear() {
        // 다음 년도로 이동
        this.currentYear++;
        this.generateCalendar(this.currentMonth, this.currentYear);
    }

    prevMonth() {
        // 이전 달로 이동
        this.currentMonth = (this.currentMonth + 11) % 12;
        if (this.currentMonth === 11) {
            this.currentYear--;
        }
        this.generateCalendar(this.currentMonth, this.currentYear);
    }

    nextMonth() {
        // 다음 달로 이동
        this.currentMonth = (this.currentMonth + 1) % 12;
        if (this.currentMonth === 0) {
            this.currentYear++;
        }
        this.generateCalendar(this.currentMonth, this.currentYear);
    }

    isLeapYear(year) {
        // 윤년
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    getFebDays(year) {
        // 2월 날짜 반환
        return this.isLeapYear(year) ? 29 : 28;
    }

    generateCalendar(month, year) {
        // 캘린더 생성
        const month_names = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        //-----expensesBox 날짜 옆에 요일 구현 예정
        // const week_names = ['일', '월', '화', '수', '목', '금', '토'];
        this.calendarDays.innerHTML = '';
        const daysOfMonth = [31, this.getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const firstDay = new Date(year, month);

        this.calendarHeaderYear.innerHTML = year;
        this.calendarBodyMonth.innerHTML = month_names[month];

        for (let i = 0; i <= daysOfMonth[month] + firstDay.getDay() - 1; i++) {
            let day = document.createElement('div');
            if (i >= firstDay.getDay()) {
                day.innerHTML = i - firstDay.getDay() + 1;
                if (
                    i - firstDay.getDay() + 1 === this.currentDate.getDate() &&
                    year === this.currentDate.getFullYear() &&
                    month === this.currentDate.getMonth()
                ) {
                    day.classList.add('current-date');
                }
                /* 클릭한 날짜 가져오기  */
                day.addEventListener('click', (event) => {
                    const clickedDate = i - firstDay.getDay() + 1;
                });
            }
            this.calendarDays.appendChild(day);
        }
    }

    // 각 날짜 클릭 시 처리
    handleDateClick(event) {
        const clickedDate = event.target.textContent;
        const year = this.currentYear;
        const month = this.currentMonth + 1;
        const clickedDay = event.target.closest('.calendar-days div');
        const allDays = document.querySelectorAll('.calendar-days div');
        const incomeBox = document.querySelector('.incomeBox');
            incomeBox.innerHTML = '';
            const outcomeBox = document.querySelector('.outcomeBox');
            outcomeBox.innerHTML = '';

        if (clickedDay) {
            clickedDay.classList.add('clicked');
            this.selectedDate.innerHTML = `${clickedDate}일`;
            this.select.innerHTML = `${year}-${month}-${clickedDate}`;

            // 다른 요소들의 클래스 제거
            allDays.forEach(day => {
                if (day !== clickedDay) {
                    day.classList.remove('clicked');
                }
            });

            if (!clickedDay.classList.contains('clicked')) {
            incomeBox.innerHTML = '';
            outcomeBox.innerHTML = '';
        }

        clickedDay.classList.toggle('clicked');
        }
    }

    displayExpenseBox() {
        this.calendarDays.childNodes.forEach((day) => {
            // 초기화
            const incomeBox = document.querySelector('.incomeBox');
            incomeBox.innerHTML = '';
            const outcomeBox = document.querySelector('.outcomeBox');
            outcomeBox.innerHTML = '';
            // calendarDays의 자식 요소에 대해 forEach를 사용
            day.addEventListener('click', () => {
                const expensesBoxStyle = getComputedStyle(this.expensesBox.expensesBox1);
                if (expensesBoxStyle.display === 'block') {
                    this.expensesBox.expensesBox1.style.display = 'none';
                    this.quote.quote.style.display = 'block';
                } else {
                    this.quote.quote.style.display = 'none';
                    this.expensesBox.expensesBox1.style.display = 'block';
                }

                this.quote.updateQuote();
            });
        });
    }
}

class ExpensesBox {
    constructor(socket, expenseAdd) {
        this.socket = socket;
        this.expenseAdd = expenseAdd;
        this.expenseAddDiv = document.querySelector('.expenseAdd');
        this.expensesBox1 = document.querySelector('#expensesBox1');
        this.incomeBox = document.querySelector('.incomeBox');
        this.outcomeBox = document.querySelector('.outcomeBox');

        this.outcomeBtn = document.querySelector('.outcomeBtn');
        this.incomeBtn = document.querySelector('.incomeBtn');

        this.quote = new Quote();
        this.quoteDiv = document.querySelector('#quote');

        this.expensesBox = document.querySelector('.expensesBox');
        this.backBtn = document.querySelector('#backBtn');
        this.expenseBtns = document.querySelectorAll('.expensesBtn');
        this.expenseList = document.querySelector('.expenseList');
        this.addButton = document.querySelector('#addListBtn');

        this.categorys = document.querySelector('.categorys');
        this.amount = document.querySelector('.amount');
        this.detail = document.querySelector('.detail');
        this.cancelBtn = document.querySelector('.cancelBtn');
        this.commitBtn = document.querySelector('.commitBtn');

        this.select = document.querySelector('#select');

        this.expenseBtns.forEach((button) => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
        this.clickOutcomeBtn = this.clickOutcomeBtn.bind(this);
        this.clickIncomeBtn = this.clickIncomeBtn.bind(this);
        // this.expenseList.addEventListener('click', this.handleExpenseItemClick.bind(this));

        this.clickBackBtn();
        this.clickOutcomeBtn(); // expensesBox 지출 버튼 메소드
        this.clickIncomeBtn(); // expensesBox 수입 버튼 메소드
        this.clickAddListBtn(); // expenseAdd 넘어가기 메소드
    }

    handleItemClick(event) {
        // 클릭된 요소의 부모 중 클래스가 'incomeList'인 요소를 찾기
        const clickedItem = event.target.closest('.incomeList');
        if (!clickedItem) { // 클릭된 요소가 없을 경우 콘솔에 출력
            console.error('clickedItem not found');
            return;
        }

        // incomeList의 내용 가져오기
        const amount = clickedItem.querySelector('.amount').textContent.trim();
        const detail = clickedItem.querySelector('.detail').textContent.trim();

        // incomeList에 내용 채우기
        this.amount.querySelector('input').value = amount;
        this.detail.querySelector('input').value = detail;

        // expenseAdd를 보여줌
        this.expenseAddDiv.style.display = 'block';
        this.expensesBox.style.display = 'none';

        // 수정된 내용을 저장할 때 기존 expenseItem 삭제
        this.commitBtn.addEventListener('click', () => {
            // 기존 expenseItem 삭제
            clickedItem.remove();

            // 입력된 내용 가져오기
            const newAmount = this.amount.querySelector('input').value;
            const newDetail = this.detail.querySelector('input').value;

            /// 새로운 expense 요소 생성
            const newExpenseItem = document.createElement('div');
            newExpenseItem.classList.add('expenseItem');
            newExpenseItem.innerHTML = `
            <div class="amount">${newAmount}</div>
            <div class="detail">${newDetail}</div>
            `;

            // expenseList에 새로운 expenseItem 추가
            this.expenseList.appendChild(newExpenseItem);

            // expenseAdd 숨김
            this.expenseAddDiv.style.display = 'none';
        });
    }

    clickOutcomeBtn() {
        this.outcomeBtn.addEventListener('click', () => {
            this.incomeBox.innerHTML = '';
            this.outcomeBox.innerHTML = '';
            this.expensesBox1.style.display = 'block'; // 수정: 지출 목록 표시
            this.incomeBox.style.display = 'none'; // 수정: 수입 목록 숨기기
            this.outcomeBox.style.display = 'block'; // 추가: 지출 상자 표시
            // 입력 필드 초기화
            this.amount.querySelector('input').value = '';
            this.detail.querySelector('input').value = '';

            const data = {
                cmd: 'Expenses',
                cmd2: 'getExpensesList',
                userId: sessionStorage.getItem('userId'),
                expensesDate: this.select.textContent,
                type: false
            }

            const jsonData = JSON.stringify(data);
            this.socket.sendMessage(jsonData);
        });
    }

    clickIncomeBtn() {
        this.incomeBtn.addEventListener('click', () => {
            this.incomeBox.innerHTML = '';
            this.outcomeBox.innerHTML = '';
            this.expensesBox1.style.display = 'block'; // 수정: 지출 목록 표시
            this.incomeBox.style.display = 'block'; // 수정: 수입 목록 표시
            this.outcomeBox.style.display = 'none'; // 추가: 지출 상자 숨기기
            // 입력 필드 초기화
            this.amount.querySelector('input').value = '';
            this.detail.querySelector('input').value = '';

            const data = {
                cmd: 'Expenses',
                cmd2: 'getExpensesList',
                userId: sessionStorage.getItem('userId'),
                expensesDate: this.select.textContent,
                type: true
            }

            const jsonData = JSON.stringify(data);
            this.socket.sendMessage(jsonData);
        });
    }

    clickBackBtn() {
        this.backBtn.addEventListener('click', () => {
            this.expensesBox1.style.display = 'none';
            this.quote.quote.style.display = 'block'; // quote를 다시 보여주도록 설정
            this.quote.updateQuote(); // quote를 업데이트
        });
    }

    clickAddListBtn() {
        // expenseAdd 넘어가기 메소드
        this.addButton.addEventListener('click', () => {
            this.expensesBox1.style.display = 'none';
            this.expenseAddDiv.style.display = 'block';
            this.categorys.classList.add('hidden');
            this.amount.classList.add('hidden');
            this.detail.classList.add('hidden');
            this.cancelBtn.classList.add('hidden');
            this.commitBtn.classList.add('hidden');
            // 입력 필드 초기화
            this.amount.querySelector('input').value = '';
            this.detail.querySelector('input').value = '';
        });
    }

    handleButtonClick(event) {
        const clickedButton = event.target;

        document.querySelectorAll('.clicked').forEach((button) => {
            button.classList.remove('clicked');
        });

        clickedButton.classList.add('clicked');
    }

    listHandler(jsonData) {
        // 초기화
        this.incomeBox.innerHTML = '';
        this.outcomeBox.innerHTML = '';

        if (jsonData && jsonData['expensesList']) {
            jsonData['expensesList'].forEach((expenses) => {
                const categoryId = expenses['categoryId'];
                const type = expenses['type'];
                const money = expenses['money'];
                const memo = expenses['memo'];
                let categoryName = '';

                switch (categoryId) {
                    case 1:
                        categoryName = '자기계발';
                        break;
                    case 2:
                        categoryName = '문화생활';
                        break;
                    case 3:
                        categoryName = '금융';
                        break;
                    case 4:
                        categoryName = '보험';
                        break;
                    case 5:
                        categoryName = '주거';
                        break;
                    case 6:
                        categoryName = '쇼핑';
                        break;
                    case 7:
                        categoryName = '통신';
                        break;
                    case 8:
                        categoryName = '교통';
                        break;
                    case 9:
                        categoryName = '식비';
                        break;
                    case 10:
                        categoryName = '기타';
                        break;
                    case 11:
                        categoryName = '용돈';
                        break;
                    case 12:
                        categoryName = '금융소득';
                        break;
                    case 13:
                        categoryName = '상여금';
                        break;
                    case 14:
                        categoryName = '월급';
                        break;
                }

                const expenseItem = document.createElement('div');

                if (type === true) {
                    expenseItem.classList.add('incomeList');
                    expenseItem.innerHTML = `
                    <p class="categoryName">${categoryName}</p>
                    <p class="money">${money}원</p>
                    <p class="memo">${memo}</p>
                    `;
                    this.incomeBox.appendChild(expenseItem);
                } else if (type === false) {
                    expenseItem.classList.add('outcomeList');
                    expenseItem.innerHTML = `
                    <p class="categoryName">${categoryName}</p>
                    <p class="money">${money}원</p>
                    <p class="memo">${memo}</p>
                    `;
                    this.outcomeBox.appendChild(expenseItem);
                }
            });
        } else {
            const expenseIncomeItem = document.createElement('div');
            expenseIncomeItem.classList.add('incomeList');
            expenseIncomeItem.innerHTML = `
        <p class="memo">조회할 데이터가 없습니다.</p>
        `;
            document.querySelector('.incomeBox').appendChild(expenseIncomeItem);

            const expenseOutcomeItem = document.createElement('div');
            expenseOutcomeItem.classList.add('outcomeList');
            expenseOutcomeItem.innerHTML = `
        <p class="memo">조회할 데이터가 없습니다.</p>
        `;
            document.querySelector('.outcomeBox').appendChild(expenseOutcomeItem);
        }
    }
}

class ExpenseAdd {
    constructor(socket) {
        this.socket = socket;
        this.quote = new Quote();

        this.budgetExpenseDivergency = 'expenses';

        this.categoryId = 9;
        this.type = 0;

        this.expensesBox1 = document.querySelector('#expensesBox1');
        this.expenseAddDiv = document.querySelector('.expenseAdd');
        this.expenseList = document.querySelector('.expenseList');
        this.backBtn2 = document.querySelector('#backBtn2');
        this.budgetBtn = document.querySelector('#budget');
        this.incomeBtn = document.querySelector('#income');
        this.outcomeBtn = document.querySelector('#outcome');
        this.categoryBtn = document.querySelectorAll('.categoryBtn');
        this.select = document.querySelector('#select');
        this.quoteDiv = document.querySelector('#quote');

        this.categorys = document.querySelector('.categorys');
        this.incomeCategoryGrid = document.querySelector('.incomeCategoryGrid');
        this.outcomeCategoryGrid = document.querySelector('.outcomeCategoryGrid');
        this.categoryBtns = document.querySelectorAll('.categoryBtn');
        this.amount = document.querySelector('.amount');
        this.detail = document.querySelector('.detail');
        this.cancelBtn = document.querySelector('.cancelBtn');
        this.commitBtn = document.querySelector('.commitBtn');

        // 초기에 입력창들을 숨김
        this.amount.classList.add('hidden');
        this.detail.classList.add('hidden');
        this.cancelBtn.classList.add('hidden');
        this.commitBtn.classList.add('hidden');

        this.clickBudgeBtn = this.clickBudgeBtn.bind(this);
        this.clickIncomeBtn2 = this.clickIncomeBtn2.bind(this);
        this.clickOutcomeBtn2 = this.clickOutcomeBtn2.bind(this);
        this.categoryBtns.forEach((button) => {
            button.addEventListener('click', this.handleCategoryBtnClick.bind(this));
        });

        this.commitBtn.addEventListener('click', () => {
            // 분기 설정
            if (this.budgetExpenseDivergency === 'budget') {
                // budget 처리 연산
            } else if (this.budgetExpenseDivergency === 'expenses') {
                this.submit();
            }
        });

        this.incomeBtn.addEventListener('click', (e) => {
            this.type = true;
            this.categoryId = 14;
            this.budgetExpenseDivergency = 'expenses';
        });

        this.outcomeBtn.addEventListener('click', (e) => {
            this.type = false;
            this.categoryId = 9;
            this.budgetExpenseDivergency = 'expenses';
        });

        this.categoryBtn.forEach((element) => {
            element.addEventListener('click', (event) => {
                this.categoryId = event.target.getAttribute('id');
            });
        });

        this.clickBackBtn2();
        this.clickBudgeBtn();
        this.clickIncomeBtn2();
        this.clickOutcomeBtn2();
        this.clickCancelBtn();
    }

    clickBackBtn2() {
        this.backBtn2.addEventListener('click', () => {
            this.expenseAddDiv.style.display = 'none';
            this.quote.quote.style.display = 'block';
            this.quote.updateQuote();
        });
    }

    clickBudgeBtn() {
        this.budgetBtn.addEventListener('click', () => {
            this.categorys.classList.add('hidden');
            this.amount.classList.remove('hidden');
            this.detail.classList.add('hidden');
            this.cancelBtn.classList.remove('hidden');
            this.commitBtn.classList.remove('hidden');
            this.budgetExpenseDivergency = 'budget';
        });
    }

    clickIncomeBtn2() {
        this.incomeBtn.addEventListener('click', () => {
            this.categorys.classList.remove('hidden');
            this.incomeCategoryGrid.classList.remove('hidden');
            this.outcomeCategoryGrid.classList.add('hidden');
            this.amount.classList.remove('hidden');
            this.detail.classList.remove('hidden');
            this.cancelBtn.classList.remove('hidden');
            this.commitBtn.classList.remove('hidden');
        });
    }

    clickOutcomeBtn2() {
        this.outcomeBtn.addEventListener('click', () => {
            this.categorys.classList.remove('hidden');
            this.incomeCategoryGrid.classList.add('hidden');
            this.outcomeCategoryGrid.classList.remove('hidden');
            this.amount.classList.remove('hidden');
            this.detail.classList.remove('hidden');
            this.cancelBtn.classList.remove('hidden');
            this.commitBtn.classList.remove('hidden');
        });
    }

    handleCategoryBtnClick(event) {
        const clickedButton = event.target;

        document.querySelectorAll('.clicked').forEach((button) => {
            button.classList.remove('clicked');
        });

        clickedButton.classList.add('clicked');
    }

    clickCancelBtn() {
        this.cancelBtn.addEventListener('click', () => {
            this.expenseAddDiv.style.display = 'none';
            this.quoteDiv.style.display = 'block';
            this.quote.updateQuote();
        });
    }

    // clickCommitBtn() {

    //     // 입력된 내용 가져오기
    //     // -----------------------
    //     const selectedCategory = document.querySelector('.categoryBtn.selected');
    //     const category = selectedCategory ? selectedCategory.textContent.trim() : '';
    //     const amount = this.amount.querySelector('input').value;
    //     const detail = this.detail.querySelector('input').value;

    //     // 새로운 expense 요소 생성
    //     const expenseItem = document.createElement('div');
    //     expenseItem.classList.add('expenseItem');
    //     expenseItem.innerHTML = `
    //         <span class="category">${category}</span><span class="amount"> ${amount} </span><span class="detail"> ${detail}</span>
    //          `;

    //     console.log(expenseItem);
    //     this.expenseList.append(expenseItem);

    //     this.amount.querySelector('input').value = '';
    //     this.detail.querySelector('input').value = '';

    //     this.expenseAddDiv.style.display = 'none';
    //     this.expensesBox1.style.display = 'block';
    //     // this.quote.updateQuote();
    // }

    submit() {
        const data = {
            cmd: 'Expenses',
            cmd2: 'insertExpenses',
            userId: sessionStorage.getItem('userId'),
            categoryId: this.categoryId,
            type: this.type,
            money: document.querySelector('#amount').value,
            memo: document.querySelector('#detail').value,
            expensesDate: this.select.textContent,
        };

        const jsonData = JSON.stringify(data);
        this.socket.sendMessage(jsonData);

        // // 입력 필드 초기화
        // this.clickCommitBtn();
    }

    insertHandler(jsonData) {
        switch (jsonData['result']) {
            case 'success':
                Swal.fire({
                    icon: 'success',
                    title: '수입/지출 내역 작성 완료',
                    showConfirmButton: false,
                    timer: 1000,
                });
                break;
            case 'fail':
                Swal.fire({
                    icon: 'error',
                    title: '수입/지출 내역 작성 실패',
                    showConfirmButton: false,
                    timer: 1000,
                });
                break;
        }
    }
}

function initialize() {

    const expenseAdd = new ExpenseAdd(socket);
    const expensesBox = new ExpensesBox(socket, expenseAdd);
    const calendar = new Calendar(socket, expensesBox);
    calendar.displayExpenseBox();

    const circleButtons = document.querySelectorAll('.circle');

    circleButtons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
    });

    circleButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });

    function handleButtonClick(event) {
        const clickedButton = event.target;

        document.querySelectorAll('.clicked').forEach((button) => {
            button.classList.remove('clicked');
        });

        clickedButton.classList.add('clicked');
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     initialize();
// });

export { Calendar, Quote, ExpensesBox, ExpenseAdd };

/* 웹 페이지 테마를 변경하는 기능
   localStorage 사용
---------------------------------*/
// 페이지 로드 시 저장된 테마 적용 
window.addEventListener('load', function () {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

// 테마 변경 시 localStorage에 저장 
document.getElementById('pinkTheme').addEventListener('click', function () {
    applyTheme('pink');
    localStorage.setItem('theme', 'pink');
});

document.getElementById('greenTheme').addEventListener('click', function () {
    applyTheme('green');
    localStorage.setItem('theme', 'green');
});

document.getElementById('blueTheme').addEventListener('click', function () {
    applyTheme('blue');
    localStorage.setItem('theme', 'blue');
});

// 테마 적용 함수 
function applyTheme(theme) {
    var iframe = document.querySelector('iframe');
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    var header = iframeDoc.querySelector('header');
    var styleTag = document.createElement('style');

    switch (theme) {
        case 'pink':
            header.style.backgroundColor = 'rgba(242, 111, 111, 0.3)';
            styleTag.innerHTML = `
            .incomeCategoryGrid button,
            .outcomeCategoryGrid button,
            .amount input,
            .detail input,
            .calendar-header,
            .year-change:hover {
                background-color: rgba(242, 111, 111, 0.3);
            }

            #month,
            .month-change pre,
            #click-account,
            .calendar-days div.current-date {
                color: rgba(242, 111, 111, 1);
            }
    
            progress::-webkit-progress-bar {
                background-color: rgba(242, 111, 111, 0.2);
            }
    
            progress::-webkit-progress-value {
                background-color: rgba(242, 111, 111, 1);
            }
    
            .month-change:hover {
                background-color: rgba(242, 111, 111, 0.5);
            }
    
            .calendar-days div.clicked {
                background-color: rgba(242, 111, 111, 0.8);
                border-radius: 20%;
                color: #f8fbff;
            }

            .categoryBtn.clicked,
            .commitBtn,
            #addListBtn {
                background-color: rgba(242, 111, 111, 0.6);
            }
            `;
            break;
        case 'green':
            header.style.backgroundColor = 'rgba(111, 242, 132, 0.3)';
            styleTag.innerHTML = `
            .incomeCategoryGrid button,
            .outcomeCategoryGrid button,
            .amount input,
            .detail input,
            .calendar-header,
            .year-change:hover {
                background-color: rgba(111, 242, 132, 0.3);
            }
    
            #click-account,
            #month,
            .month-change pre,
            .calendar-days div.current-date {
                color: rgba(111, 242, 132, 1);
            }
    
            progress::-webkit-progress-bar {
                border-radius: 20px;
                background-color: rgba(111, 242, 132, 0.2);
            }
    
            progress::-webkit-progress-value {
                border-radius: 20px;
                background-color: rgba(111, 242, 132, 1);
            }
    
            .month-change:hover {
                background-color: rgba(111, 242, 132, 0.5);
            }
    
            .calendar-days div.clicked {
                background-color: rgba(111, 242, 132, 0.8);
                border-radius: 20%;
                color: #f8fbff;
            }

            .categoryBtn.clicked,
            .commitBtn,
            #addListBtn {
                background-color: rgba(111, 242, 132, 0.6);
            }
            `;
            break;
        case 'blue':
            header.style.backgroundColor = 'rgba(55, 159, 235, 0.3)';
            styleTag.innerHTML = `
            .incomeCategoryGrid button,
            .outcomeCategoryGrid button,
            .amount input,
            .detail input,
            .calendar-header,
            .year-change:hover {
                background-color: rgba(55, 159, 235, 0.3);
            }

            #click-account,
            #month,
            .month-change pre,
            .calendar-days div.current-date {
                color: rgba(55, 159, 235, 1);
            }
    
            progress::-webkit-progress-bar {
                background-color: rgba(55, 159, 235, 0.2);
            }
    
            progress::-webkit-progress-value {
                background-color: rgba(55, 159, 235, 1);
            }
    
            .month-change:hover {
                background-color: rgba(55, 159, 235, 0.5);
            }
    
            .calendar-days div.clicked {
                background-color: rgba(55, 159, 235, 0.8);
                border-radius: 20%;
                color: #f8fbff;
            }

            .categoryBtn.clicked,
            .commitBtn,
            #addListBtn {
                background-color: rgba(55, 159, 235, 0.6);
            }
            `;
            break;
    }

    document.head.appendChild(styleTag);
}