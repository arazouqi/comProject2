class ClassInCalendar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId)
        this.allEvents = options.events || []
        this.onEventClick = options.onEventClick || (() => {})
        this.view = 'month'
        this.currentDate = new Date()
        this.currentDate.setDate(1)
        this.currentDate.setHours(0, 0, 0, 0)
        this._render()
    }

    setEvents(events) {
        this.allEvents = events
        this._render()
    }

    render() {
        this._render()
    }

    _render() {
        this.container.innerHTML = ''
        const wrapper = document.createElement('div')
        wrapper.className = 'cal-wrapper'
        wrapper.appendChild(this._buildHeader())
        if (this.view === 'month') {
            wrapper.appendChild(this._buildMonthView())
        } else {
            wrapper.appendChild(this._buildAgendaView())
        }
        this.container.appendChild(wrapper)
    }

    _buildHeader() {
        const header = document.createElement('div')
        header.className = 'cal-header'

        const left = document.createElement('div')
        left.className = 'cal-nav'

        const prevBtn = this._navBtn('←', () => { this._shiftMonth(-1); this._render() })
        const todayBtn = this._navBtn('Today', () => {
            this.currentDate = new Date()
            this.currentDate.setDate(1)
            this.currentDate.setHours(0, 0, 0, 0)
            this._render()
        })
        const nextBtn = this._navBtn('→', () => { this._shiftMonth(1); this._render() })

        left.append(prevBtn, todayBtn, nextBtn)

        const title = document.createElement('div')
        title.className = 'cal-title'
        if (this.view === 'month') {
            title.textContent = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
        } else {
            title.textContent = 'Agenda'
        }

        const switcher = document.createElement('div')
        switcher.className = 'cal-view-switcher'

        const monthBtn = document.createElement('button')
        monthBtn.className = 'cal-view-btn' + (this.view === 'month' ? ' active' : '')
        monthBtn.textContent = 'Month'
        monthBtn.onclick = () => { this.view = 'month'; this._render() }

        const agendaBtn = document.createElement('button')
        agendaBtn.className = 'cal-view-btn' + (this.view === 'agenda' ? ' active' : '')
        agendaBtn.textContent = 'Agenda'
        agendaBtn.onclick = () => { this.view = 'agenda'; this._render() }

        switcher.append(monthBtn, agendaBtn)
        header.append(left, title, switcher)
        return header
    }

    _navBtn(label, onClick) {
        const btn = document.createElement('button')
        btn.className = 'cal-nav-btn'
        btn.textContent = label
        btn.onclick = onClick
        return btn
    }

    _shiftMonth(delta) {
        const d = new Date(this.currentDate)
        d.setMonth(d.getMonth() + delta)
        this.currentDate = d
    }

    _eventsOnDay(year, month, day) {
        return this.allEvents.filter(e => {
            const s = new Date(e.start)
            return s.getFullYear() === year && s.getMonth() === month && s.getDate() === day
        })
    }

    _buildMonthView() {
        const wrap = document.createElement('div')

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const headRow = document.createElement('div')
        headRow.className = 'cal-grid cal-grid-headers'
        dayNames.forEach(d => {
            const h = document.createElement('div')
            h.className = 'cal-day-header'
            h.textContent = d
            headRow.appendChild(h)
        })
        wrap.appendChild(headRow)

        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        const firstWeekDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const totalCells = Math.ceil((firstWeekDay + daysInMonth) / 7) * 7

        const today = new Date()
        const cellGrid = document.createElement('div')
        cellGrid.className = 'cal-grid'

        for (let i = 0; i < totalCells; i++) {
            const dayOffset = i - firstWeekDay
            const date = new Date(year, month, 1 + dayOffset)
            const isCurMonth = date.getMonth() === month
            const isToday = date.toDateString() === today.toDateString()

            const cell = document.createElement('div')
            cell.className = 'cal-cell' +
                (!isCurMonth ? ' other-month' : '') +
                (isToday ? ' today' : '')

            const numWrap = document.createElement('div')
            numWrap.className = 'cal-date-num' + (isToday ? ' today-circle' : '')
            numWrap.textContent = date.getDate()
            cell.appendChild(numWrap)

            if (isCurMonth || !isCurMonth) {
                const dayEvents = this._eventsOnDay(date.getFullYear(), date.getMonth(), date.getDate())
                const maxShow = 2

                dayEvents.slice(0, maxShow).forEach(ev => {
                    cell.appendChild(this._eventPill(ev))
                })

                if (dayEvents.length > maxShow) {
                    const extra = dayEvents.slice(maxShow)
                    const moreEl = document.createElement('div')
                    moreEl.className = 'cal-more'
                    moreEl.textContent = `+${extra.length} more`
                    moreEl.onclick = (e) => {
                        e.stopPropagation()
                        moreEl.remove()
                        extra.forEach(ev => cell.appendChild(this._eventPill(ev)))
                    }
                    cell.appendChild(moreEl)
                }
            }

            cellGrid.appendChild(cell)
        }

        wrap.appendChild(cellGrid)
        return wrap
    }

    _eventPill(ev) {
        const pill = document.createElement('span')
        pill.className = 'cal-event-pill'
        pill.textContent = ev.title
        if (ev.extendedProps && ev.extendedProps.classGroup) {
            pill.title = `${ev.title} · ${ev.extendedProps.classGroup}`
        }
        pill.onclick = (e) => { e.stopPropagation(); this.onEventClick(ev) }
        return pill
    }

    _buildAgendaView() {
        const container = document.createElement('div')
        container.className = 'cal-agenda'

        const sorted = [...this.allEvents].sort((a, b) => new Date(a.start) - new Date(b.start))

        const groups = new Map()
        sorted.forEach(ev => {
            const key = new Date(ev.start).toDateString()
            if (!groups.has(key)) groups.set(key, { date: new Date(ev.start), events: [] })
            groups.get(key).events.push(ev)
        })

        if (groups.size === 0) {
            const empty = document.createElement('div')
            empty.className = 'cal-empty'
            empty.textContent = 'No events to display.'
            container.appendChild(empty)
            return container
        }

        const today = new Date()
        groups.forEach(({ date, events }) => {
            const row = document.createElement('div')
            row.className = 'cal-agenda-day'

            const dateCol = document.createElement('div')
            dateCol.className = 'cal-agenda-date'

            const weekdayEl = document.createElement('div')
            weekdayEl.className = 'cal-agenda-weekday'
            weekdayEl.textContent = date.toLocaleString('default', { weekday: 'short' }).toUpperCase()

            const dayNumEl = document.createElement('div')
            dayNumEl.className = 'cal-agenda-daynum' + (date.toDateString() === today.toDateString() ? ' today-num' : '')
            dayNumEl.textContent = date.getDate()

            const monthEl = document.createElement('div')
            monthEl.className = 'cal-agenda-month'
            monthEl.textContent = date.toLocaleString('default', { month: 'short', year: 'numeric' })

            dateCol.append(weekdayEl, dayNumEl, monthEl)

            const eventsCol = document.createElement('div')
            eventsCol.className = 'cal-agenda-events'

            events.forEach(ev => {
                const start = new Date(ev.start)
                const end = new Date(ev.end)
                const card = document.createElement('div')
                card.className = 'cal-agenda-event'
                card.onclick = () => this.onEventClick(ev)

                const titleEl = document.createElement('div')
                titleEl.className = 'cal-agenda-event-title'
                titleEl.textContent = ev.title

                const meta = document.createElement('div')
                meta.className = 'cal-agenda-event-meta'

                const timePart = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                const locPart = ev.extendedProps && ev.extendedProps.location ? ` · 📍 ${ev.extendedProps.location}` : ''
                const groupPart = ev.extendedProps && ev.extendedProps.classGroup ? ` · ${ev.extendedProps.classGroup}` : ''
                meta.textContent = timePart + locPart + groupPart

                card.append(titleEl, meta)
                eventsCol.appendChild(card)
            })

            row.append(dateCol, eventsCol)
            container.appendChild(row)
        })

        return container
    }
}
