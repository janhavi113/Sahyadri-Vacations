/**
 * Utility to process and normalize event data from API.
 * Handles both batch-based and single-date events,
 * filters by type, finds the next upcoming batch,
 * and returns consistent structured data for display.
 *
 * @param {Array} events - list of events from API
 * @param {String} apiUrl - base API URL for image paths
 * @param {String|Array|null} [eventTypeFilter] - optional: event type(s) to include
 * @param {Boolean} [sortByDate=true] - whether to sort events by next upcoming start date
 * @returns {Array} formatted, upcoming events
 */

export const getUpcomingEvents = (
    events,
    apiUrl,
    eventTypeFilter = null,
    sortByDate = true
) => {
    if (!Array.isArray(events)) return [];
         console.log('events',events);
         
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const processed = events
        // 🧩 1. Filter by eventType (if provided)
        .filter(event => {
            if (!eventTypeFilter) return true;
            if (Array.isArray(eventTypeFilter)) {
                return eventTypeFilter.includes(event.eventType);
            }
            return event.eventType === eventTypeFilter;
        })
        // 🧮 2. Map each event to structured format with next batch info
        .map(event => {
            let nextBatch = null;

            // If event has multiple batches → find next upcoming
            if (Array.isArray(event.batches) && event.batches.length > 0) {
                nextBatch = event.batches
                    .map(b => ({
                        ...b,
                        start: new Date(b.eventStartDate),
                        end: new Date(b.eventEndDate),
                    }))
                    .find(b => b.start >= today);
            }
            // Single-date fallback
            else if (event.eventStartDate && new Date(event.eventStartDate) >= today) {
                nextBatch = {
                    eventStartDate: event.eventStartDate,
                    eventEndDate: event.eventEndDate,
                    eventCostPerPerson: event.eventCostPerPerson,
                    eventCostPerPersonFromMumbai: event.eventCostPerPersonFromMumbai,
                    b2bPrice: event.b2bPrice,
                    start: new Date(event.eventStartDate),
                    end: new Date(event.eventEndDate),
                };
            }

            if (!nextBatch) return null;

            // 🗓 Format readable date range
            const start = nextBatch.start;
            const end = nextBatch.end;
            const batchdate = `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;

            // 💰 Determine valid prices and minimum price
            const prices = [
                nextBatch.eventCostPerPerson,
                nextBatch.eventCostPerPersonFromMumbai,
                nextBatch.b2bPrice,
            ].filter(p => p > 0);

            const minPrice = prices.length > 0 ? Math.min(...prices) : null;

            // 🧱 Return consistent structure
            return {
                eventId: event.eventId,
                eventname: event.eventname,
                eventType: event.eventType,
                url: event.Url,
                images: `${apiUrl}${event.images}`,
                batchdate,
                eventCostPerPerson: nextBatch.eventCostPerPerson,
                eventCostPerPersonFromMumbai: nextBatch.eventCostPerPersonFromMumbai,
                b2bPrice: nextBatch.b2bPrice,
                minPrice,
                startDate: start,
                endDate: end,
            };
        })
        // Remove nulls (no upcoming batch)
        .filter(e => e !== null);

    // 📅 3. Optionally sort by upcoming date
    if (sortByDate) {
        processed.sort((a, b) => a.startDate - b.startDate);
    }

    return processed;
};

export const getUnscheduledOrRecurringEvents = (events, apiUrl, eventTypeFilter = null) => {
    if (!Array.isArray(events)) return [];

    const filteredEvents = [];

    for (const event of events) {
        // ✅ Check event type filter
        if (eventTypeFilter) {
            if (Array.isArray(eventTypeFilter)) {
                if (!eventTypeFilter.includes(event.eventType)) continue;
            } else if (event.eventType !== eventTypeFilter) {
                continue;
            }
        }

        let label = null;
        let cost = null;
        let fromMumbai = null;
        let b2b = null;

        // 🔹 1. Check batches for unscheduled/recurring flags
        if (Array.isArray(event.batches) && event.batches.length > 0) {
            for (const batch of event.batches) {
                if (batch.everyWeekend) {
                    label = "Available On All Weekends";
                    cost = batch.eventCostPerPerson;
                    break;
                } else if (batch.notScheduleYet) {
                    label = "On Public Demand";
                    cost = batch.eventCostPerPerson;
                    break;
                }
            }
        }

        // 🔹 2. Fallback to event-level flags
        if (!label) {
            if (event.everyWeekend) {
                label = "Available On All Weekends";
                cost = event.eventCostPerPerson;
                fromMumbai = event.eventCostPerPersonFromMumbai;
                b2b = event.b2bPrice;
            } else if (event.notScheduleYet) {
                label = "On Public Demand";
                cost = event.eventCostPerPerson;
                fromMumbai = event.eventCostPerPersonFromMumbai;
                b2b = event.b2bPrice;
            }
        }

        // 🔹 3. Include only if valid
        if (label && cost) {
            filteredEvents.push({
                eventId: event.eventId,
                eventname: event.eventname,
                eventType: event.eventType,
                url: event.Url,
                images: `${apiUrl}${event.images}`,
                batchdate: label, // “Available On All Weekends” or “On Public Demand”
                eventCostPerPerson: cost,
                eventCostPerPersonFromMumbai: fromMumbai,
                b2bPrice: b2b,
            });
        }
    }

    return filteredEvents;
};