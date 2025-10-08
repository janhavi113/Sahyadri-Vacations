import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import logo from "../../Images/logo.png";
import "../CustomiseTour/BrochureStyles.css";

const GenerateBrochure = ({ event, inquiry, onClose }) => {
    const brochureRef = useRef();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [currentImages, setcurrentImages] = useState(event.images);
    const [isAtTop, setIsAtTop] = useState(true);
    const displayList = (data) => {
        let splitedList;
        if (data) {
            splitedList = data.replaceAll(
                '<p class="ql-align-justify">',
                '<p class="ql-align-justify ql-p">'
            );
            splitedList = splitedList.replaceAll(
                "<ul>",
                '<ul class="display-bulletin">'
            );
            splitedList = splitedList.replaceAll(
                "<ol>",
                '<ol className="display-bulletin">'
            );
            splitedList = splitedList.replaceAll("<p>", '<p class="ql-p">');
        }
        return splitedList;
    };
    useEffect(() => {
        const handleScroll = () => {
            if (brochureRef.current) {
                setIsAtTop(brochureRef.current.scrollTop === 0);
            }
        };

        const el = brochureRef.current;
        if (el) {
            el.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (el) {
                el.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    const downloadPDF = () => {
        const element = brochureRef.current;

        const opt = {
            margin: [15, 15, 20, 15],
            filename: `${event.apiname || "event"}-brochure.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };

        html2pdf()
            .from(element)
            .set(opt)
            .toPdf()
            .get("pdf")
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();

                for (let i = 2; i <= totalPages; i++) {
                    pdf.setPage(i);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();

                    const wmWidth = 100;
                    const wmHeight = 100;
                    const wmX = (pdfWidth - wmWidth) / 2;
                    const wmY = (pdfHeight - wmHeight) / 2;

                    pdf.setGState(new pdf.GState({ opacity: 0.1 }));
                    pdf.addImage(logo, "PNG", wmX, wmY, wmWidth, wmHeight);
                    pdf.setGState(new pdf.GState({ opacity: 1 }));
                }
            })
            .save();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-4/5 h-5/6 flex flex-col overflow-hidden relative">

                {/* Floating Top-Right Buttons */}
                {isAtTop && (
                    <div className="absolute top-4 right-4 flex gap-3 z-20 transition-opacity duration-300">
                        <button
                            onClick={downloadPDF}
                            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 shadow"
                        >
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 shadow"
                        >
                            X
                        </button>
                    </div>
                )}

                {/* Scrollable Content */}
                <div ref={brochureRef} className="relative flex-1 overflow-y-auto">
                    {/* COVER PAGE */}
                    <div className="cover-page relative flex flex-col justify-center items-center text-center text-white p-10">
                        {/* Logo top-right */}
                        <img
                            src={logo}
                            alt="Company Logo"
                            className="absolute top-6 right-6 w-24 h-auto"
                        />
                        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                            {event.name}
                        </h1>
                    </div>

                    {/* CONTENT PAGES */}
                    <div className="p-6 text-left">
                        {/* About Us */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">🙏 About Us</h3>
                            <p className="text-gray-700">
                                {event.aboutUs ||
                                    `Sahyadri Vacations is a Travel & Adventure organization founded by a group of passionate explorers. 
                With years of trekking and adventure experience, we aim to provide safe, fun, and memorable outdoor experiences. 
                Our mission is to connect people with nature while ensuring safety, comfort, and unforgettable memories.`}
                            </p>
                        </section>

                        {/* About the Trek */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">🏞 About the Trek</h3>
                            <p className="text-gray-700">{event.eventDetails}</p>
                        </section>

                        {/* Package */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">Package Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="font-semibold text-orange-500">
                                    Package Per Person From Pune:{" "}
                                    <span className="text-gray-700">{inquiry.eventCostPerPerson}</span>
                                </div>
                                {inquiry.eventCostPerPersonFromMumbai > 0 && <div className="font-semibold text-orange-500">
                                    Package Per Person From Mumbai:{" "}
                                    <span className="text-gray-700">{inquiry.eventCostPerPersonFromMumbai}</span>
                                </div>}
                               {inquiry.b2bPrice > 0 && <div className="font-semibold text-orange-500">
                                    Package Per Person For Base to Base :{" "}
                                    <span className="text-gray-700">{inquiry.b2bPrice}</span>
                                </div> }
                                <div className="font-semibold text-orange-500">
                                    Event Start Date::{" "}
                                    <span className="text-gray-700">{new Date(inquiry.eventStartDate).toISOString().split('T')[0]}</span>
                                </div>
                                <div className="font-semibold text-orange-500">
                                    Event End Date::{" "}
                                    <span className="text-gray-700">{new Date(inquiry.eventEndDate).toISOString().split('T')[0]}</span>
                                </div>
                            </div>
                        </section>

                        {/* Itinerary */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">📅 Itinerary</h3>
                            <div
                                className="text-left"
                                dangerouslySetInnerHTML={{
                                    __html: displayList(event.itinerary),
                                }}
                            />
                        </section>

                        {/* Highlights */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">🌟 Highlights</h3>
                            <div
                                className="text-left"
                                dangerouslySetInnerHTML={{
                                    __html: displayList(event.highlights),
                                }}
                            />
                        </section>

                        {/* Includes */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">✅ Includes</h3>
                            <div
                                className="text-left"
                                dangerouslySetInnerHTML={{
                                    __html: displayList(event.costIncludes),
                                }}
                            />
                        </section>

                        {/* Excludes */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">❌ Excludes</h3>
                            <div
                                className="text-left"
                                dangerouslySetInnerHTML={{
                                    __html: displayList(event.costExcludes),
                                }}
                            />
                        </section>

                        {/* Things to Carry */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">🎒 Things to Carry</h3>
                            <div
                                className="text-left"
                                dangerouslySetInnerHTML={{
                                    __html: displayList(event.thingsToCarry),
                                }}
                            />
                        </section>

                        {/* Instructions */}
                        <section className="mb-6 border-b pb-3">
                            <h3 className="text-lg font-semibold mb-2">
                                📢 Instructions for Participants
                            </h3>
                            <ol className="list-decimal pl-6 text-gray-700 leading-relaxed">
                                <li>Please follow the trek leader’s instructions.</li>
                                <li>Consumption of alcohol, smoking, or drugs is strictly prohibited.</li>
                                <li>Please avoid wearing gold ornaments or carrying valuables.</li>
                                <li>Carry your personal medications (if any).</li>
                                <li>Use dustbins and help us maintain cleanliness.</li>
                                <li>Respect nature and local culture. Do not pluck plants or harm wildlife.</li>
                                <li>Sahyadri Vacations reserves the right to modify or cancel the event in case of unavoidable circumstances.</li>
                            </ol>
                        </section>

                        {/* Images */}
                        <div className="p-2 bg-gray-50">
                            <span className="font-bold capitalize">Images:</span>
                            <ul>
                                {currentImages.map((file) => (
                                    <li className="image-display" key={file}>
                                        <img
                                            src={`${apiUrl}${file}`}
                                            width="200"
                                            height="250"
                                            alt="Event"
                                            onLoad={() => {
                                                URL.revokeObjectURL(file);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <footer className="mt-10 text-sm text-gray-600">
                            📸 Follow us @sahyadri_vacations
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateBrochure;
