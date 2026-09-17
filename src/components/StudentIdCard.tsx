
// import { useRef, useEffect, useState } from "react";
// import Image from "next/image";
// import { Card, CardContent } from "@/src/components/ui/card";
// import { Button } from "@/src/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
// import { Separator } from "@/src/components/ui/seperator";
// import { Badge } from "@/src/components/ui/badge";
// import { Download, Printer, ArrowLeft, Home } from "lucide-react";
// import { generateBarcode } from "../lib/generate-barcode";
// import universityLogo from "../public/images/universityLogo.png";
// import { useRouter } from "next/navigation";
// import * as jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// interface StudentIDCardProps {
//   student: {
//     full_name: string;
//     studentId: string;
//     study_year: number;
//     program: string;
//     avatar?: string;
//   };
//   profile: {
//     email: string;
//     user_id: string;
//   };
// }

// const StudentIDCard = ({ student, profile }: StudentIDCardProps) => {
//   const router = useRouter();
//   const frontRef = useRef<HTMLDivElement>(null);
//   const backRef = useRef<HTMLDivElement>(null);
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [barcodeImage, setBarcodeImage] = useState<string>("");
//   const [flipped, setFlipped] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       student?.studentId && setBarcodeImage(generateBarcode(student?.studentId));
//     }
//   }, [student?.studentId]);

//   const handlePrint = () => {
//     if (frontRef.current && backRef.current) {
//       const printWindow = window.open('', '_blank');
//       if (printWindow) {
//         printWindow.document.write(`
//           <!DOCTYPE html>
//           <html>
//             <head>
//               <title>Student ID Card - ${student?.full_name}</title>
//               <style>
//                 body {
//                   margin: 0;
//                   padding: 0;
//                   font-family: Arial, sans-serif;
//                 }
//                 .preview-container {
//                   display: flex;
//                   gap: 20px;
//                   align-items: center;
//                   justify-content: center;
//                   margin: 20px;
//                 }
//                 .card-preview {
//                   border: 1px solid #ccc;
//                   border-radius: 8px;
//                   padding: 10px;
//                   background: white;
//                   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//                 }
//                 h2 {
//                   text-align: center;
//                   margin-bottom: 20px;
//                 }
//                 .card-container {
//                   width: 85.6mm;
//                   height: 54mm;
//                   page-break-inside: avoid;
//                   display: flex;
//                   align-items: center;
//                   justify-content: center;
//                   border: 1px solid #e5e7eb;
//                   border-radius: 6px;
//                   background: white;
//                   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//                   overflow: hidden;
//                 }
//                 .card-content {
//                   padding: 16px;
//                   display: flex;
//                   flex-direction: column;
//                   justify-content: space-between;
//                   height: 100%;
//                   width: 100%;
//                   position: relative;
//                 }
//                 .watermark {
//                   position: absolute;
//                   top: 50%;
//                   left: 50%;
//                   width: 200px;
//                   transform: translate(-50%, -50%);
//                   opacity: 0.1;
//                   pointer-events: none;
//                 }
//                 .header {
//                   text-align: center;
//                   margin-bottom: 8px;
//                 }
//                 .header img {
//                   width: 56px;
//                   margin: 0 auto 4px;
//                 }
//                 .header h3 {
//                   font-size: 14px;
//                   font-weight: bold;
//                   color: #1e40af;
//                   text-transform: uppercase;
//                 }
//                 .header p {
//                   font-size: 10px;
//                   color: #6b7280;
//                 }
//                 .separator {
//                   margin: 8px 0;
//                   border: 0;
//                   border-top: 1px solid #e5e7eb;
//                 }
//                 .student-info {
//                   display: flex;
//                   align-items: center;
//                   gap: 12px;
//                   margin-bottom: 8px;
//                 }
//                 .avatar {
//                   width: 64px;
//                   height: 64px;
//                   border: 1px solid #e5e7eb;
//                   border-radius: 50%;
//                 }
//                 .avatar-fallback {
//                   font-size: 14px;
//                   font-weight: 600;
//                 }
//                 .student-info h4 {
//                   font-size: 14px;
//                   font-weight: 600;
//                   color: #111827;
//                 }
//                 .student-info p {
//                   font-size: 10px;
//                   color: #6b7280;
//                 }
//                 .badge {
//                   margin-top: 4px;
//                   font-size: 10px;
//                   padding: 2px 6px;
//                   background: #e5e7eb;
//                   border-radius: 4px;
//                 }
//                 .more-info {
//                   font-size: 11px;
//                   margin-bottom: 8px;
//                 }
//                 .more-info div {
//                   display: flex;
//                   justify-content: space-between;
//                 }
//                 .more-info span:first-child {
//                   color: #6b7280;
//                 }
//                 .more-info span:last-child {
//                   font-weight: 500;
//                   color: #111827;
//                 }
//                 .footer-text {
//                   text-align: center;
//                   font-size: 9px;
//                   color: #6b7280;
//                 }
//                 .back-content {
//                   display: flex;
//                   flex-direction: column;
//                   justify-content: space-between;
//                   height: 100%;
//                 }
//                 .barcode-container {
//                   flex: 1;
//                   display: flex;
//                   flex-direction: column;
//                   align-items: center;
//                   justify-content: center;
//                 }
//                 .barcode-container p {
//                   font-size: 10px;
//                   color: #6b7280;
//                   margin-bottom: 4px;
//                 }
//                 .barcode-container img {
//                   border: 1px solid #e5e7eb;
//                   border-radius: 4px;
//                   background: white;
//                 }
//                 @media print {
//                   @page {
//                     size: 85.6mm 54mm;
//                     margin: 0;
//                   }
//                   .preview-container {
//                     display: none;
//                   }
//                   .card-container {
//                     page-break-after: always;
//                   }
//                   .card-container:last-child {
//                     page-break-after: auto;
//                   }
//                 }
//               </style>
//             </head>
//             <body>
//               <h2>Student ID Card - ${student?.full_name}</h2>
//               <div class="preview-container">
//                 <div class="card-preview">
//                   <h3>Front</h3>
//                   ${frontRef.current.innerHTML}
//                 </div>
//                 <div class="card-preview">
//                   <h3>Back</h3>
//                   ${backRef.current.innerHTML}
//                 </div>
//               </div>
//               <div class="card-container">
//                 ${frontRef.current.innerHTML}
//               </div>
//               <div class="card-container">
//                 ${backRef.current.innerHTML}
//               </div>
//             </body>
//           </html>
//         `);
//         printWindow.document.close();
//         printWindow.focus();
//         printWindow.print();
//       }
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!cardRef.current) return;
//     const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
//     const imgData = canvas.toDataURL("image/png");

//     // ID Card size: 85.6mm × 54mm
//     const pdf = new jsPDF.jsPDF("l", "mm", [54, 85.6]);
//     pdf.addImage(imgData, "PNG", 0, 0, 85.6, 54);
//     pdf.save(`StudentID-${student.studentId}.pdf`);
//   };

//   // const handleDownloadPDF = async () => {
//   //   setIsDownloading(true);
    
//   //   if (frontRef.current && backRef.current) {
//   //     const printWindow = window.open('', '_blank');
//   //     if (printWindow) {
//   //       printWindow.document.write(`
//   //         <!DOCTYPE html>
//   //         <html>
//   //           <head>
//   //             <title>Student ID Card - ${student?.full_name}</title>
//   //             <style>
//   //               body {
//   //                 margin: 0;
//   //                 padding: 0;
//   //                 font-family: Arial, sans-serif;
//   //               }
//   //               .card-container {
//   //                 width: 85.6mm;
//   //                 height: 54mm;
//   //                 page-break-inside: avoid;
//   //                 display: flex;
//   //                 align-items: center;
//   //                 justify-content: center;
//   //                 border: 1px solid #e5e7eb;
//   //                 border-radius: 6px;
//   //                 background: white;
//   //                 box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//   //                 overflow: hidden;
//   //               }
//   //               .card-content {
//   //                 padding: 16px;
//   //                 display: flex;
//   //                 flex-direction: column;
//   //                 justify-content: space-between;
//   //                 height: 100%;
//   //                 width: 100%;
//   //                 position: relative;
//   //               }
//   //               .watermark {
//   //                 position: absolute;
//   //                 top: 50%;
//   //                 left: 50%;
//   //                 width: 200px;
//   //                 transform: translate(-50%, -50%);
//   //                 opacity: 0.1;
//   //                 pointer-events: none;
//   //               }
//   //               .header {
//   //                 text-align: center;
//   //                 margin-bottom: 8px;
//   //               }
//   //               .header img {
//   //                 width: 56px;
//   //                 margin: 0 auto 4px;
//   //               }
//   //               .header h3 {
//   //                 font-size: 14px;
//   //                 font-weight: bold;
//   //                 color: #1e40af;
//   //                 text-transform: uppercase;
//   //               }
//   //               .header p {
//   //                 font-size: 10px;
//   //                 color: #6b7280;
//   //               }
//   //               .separator {
//   //                 margin: 8px 0;
//   //                 border: 0;
//   //                 border-top: 1px solid #e5e7eb;
//   //               }
//   //               .student-info {
//   //                 display: flex;
//   //                 align-items: center;
//   //                 gap: 12px;
//   //                 margin-bottom: 8px;
//   //               }
//   //               .avatar {
//   //                 width: 64px;
//   //                 height: 64px;
//   //                 border: 1px solid #e5e7eb;
//   //                 border-radius: 50%;
//   //               }
//   //               .avatar-fallback {
//   //                 font-size: 14px;
//   //                 font-weight: 600;
//   //               }
//   //               .student-info h4 {
//   //                 font-size: 14px;
//   //                 font-weight: 600;
//   //                 color: #111827;
//   //               }
//   //               .student-info p {
//   //                 font-size: 10px;
//   //                 color: #6b7280;
//   //               }
//   //               .badge {
//   //                 margin-top: 4px;
//   //                 font-size: 10px;
//   //                 padding: 2px 6px;
//   //                 background: #e5e7eb;
//   //                 border-radius: 4px;
//   //               }
//   //               .more-info {
//   //                 font-size: 11px;
//   //                 margin-bottom: 8px;
//   //               }
//   //               .more-info div {
//   //                 display: flex;
//   //                 justify-content: space-between;
//   //               }
//   //               .more-info span:first-child {
//   //                 color: #6b7280;
//   //               }
//   //               .more-info span:last-child {
//   //                 font-weight: 500;
//   //                 color: #111827;
//   //               }
//   //               .footer-text {
//   //                 text-align: center;
//   //                 font-size: 9px;
//   //                 color: #6b7280;
//   //               }
//   //               .back-content {
//   //                 display: flex;
//   //                 flex-direction: column;
//   //                 justify-content: space-between;
//   //                 height: 100%;
//   //               }
//   //               .barcode-container {
//   //                 flex: 1;
//   //                 display: flex;
//   //                 flex-direction: column;
//   //                 align-items: center;
//   //                 justify-content: center;
//   //               }
//   //               .barcode-container p {
//   //                 font-size: 10px;
//   //                 color: #6b7280;
//   //                 margin-bottom: 4px;
//   //               }
//   //               .barcode-container img {
//   //                 border: 1px solid #e5e7eb;
//   //                 border-radius: 4px;
//   //                 background: white;
//   //               }
//   //               @media print {
//   //                 @page {
//   //                   size: 85.6mm 54mm;
//   //                   margin: 0;
//   //                 }
//   //                 .card-container {
//   //                   page-break-after: always;
//   //                 }
//   //                 .card-container:last-child {
//   //                   page-break-after: auto;
//   //                 }
//   //               }
//   //             </style>
//   //           </head>
//   //           <body>
//   //             <div class="card-container">
//   //               ${frontRef.current.innerHTML}
//   //             </div>
//   //             <div class="card-container">
//   //               ${backRef.current.innerHTML}
//   //             </div>
//   //           </body>
//   //         </html>
//   //       `);
//   //       printWindow.document.close();
//   //       setTimeout(() => {
//   //         printWindow.focus();
//   //         printWindow.print();
//   //         setIsDownloading(false);
//   //       }, 1000);
//   //     } else {
//   //       setIsDownloading(false);
//   //     }
//   //   }
//   // };

//   const handleBackToDashboard = () => {
//     router.push("/dashboard");
//   };

//   return profile === null ? (
//     <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//       <p className="text-lg text-muted-foreground">Go back to dashboard and complete your profile</p>
//       <Button onClick={handleBackToDashboard} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
//         <Home className="w-4 h-4 mr-2" />
//         Back to Dashboard
//       </Button>
//     </div>
//   ) : (
//     <div className="space-y-6">
//       {/* Header with Back Button */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handleBackToDashboard}
//             className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </Button>
//           <h2 className="text-2xl font-bold text-foreground">Student ID Card</h2>
//         </div>
//         <div className="flex gap-2">
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handleDownloadPDF}
//             disabled={isDownloading}
//             className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             {isDownloading ? "Preparing PDF..." : "Download PDF"}
//           </Button>
//           <Button 
//             variant="outline" 
//             size="sm" 
//             onClick={handlePrint}
//             className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
//           >
//             <Printer className="w-4 h-4 mr-2" />
//             Print
//           </Button>
//         </div>
//       </div>

//       <div
//         className="relative mx-auto aspect-[1.586/1] w-[442px] cursor-pointer [perspective:1000px]"
//         onClick={() => setFlipped((f) => !f)}
//       >
//         <div
//           className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
//             flipped ? "[transform:rotateY(180deg)]" : ""
//           }`}
//         >
//           {/* FRONT FACE */}
//           <Card 
//             ref={frontRef} 
//             className="absolute inset-0 h-full w-full rounded-md border bg-white shadow-md [backface-visibility:hidden]"
//           >
//             <CardContent className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
//               {/* Watermark */}
//               <Image
//                 width={100}
//                 height={100}
//                 src={universityLogo}
//                 alt="Logo watermark"
//                 className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
//               />

//               <div className="relative">
//                 {/* Header */}
//                 <div className="text-center mb-2">
//                   <Image
//                     width={100}
//                     height={100}
//                     src={universityLogo}
//                     alt="Baze University Logo"
//                     className="mx-auto w-14 mb-1"
//                   />
//                   <h3 className="text-base font-bold text-primary uppercase">
//                     BASE UNIVERSITY STUDENT ID
//                   </h3>
//                   <p className="text-xs text-muted-foreground">
//                     Student Identification Card
//                   </p>
//                 </div>

//                 <Separator className="mb-2" />

//                 {/* Student Info */}
//                 <div className="flex items-center space-x-3 mb-2">
//                   <Avatar className="w-16 h-16 border">
//                     <AvatarImage src={student.avatar} alt={student?.full_name} />
//                     <AvatarFallback className="text-sm font-semibold">
//                       {student && student?.full_name
//                         ?.split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-sm text-foreground leading-tight">
//                       {student.full_name}
//                     </h4>
//                     <p className="text-xs text-muted-foreground">
//                       ID: {student && student?.studentId}
//                     </p>
//                     <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0.5">
//                       Year {student && student?.study_year}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* More Info */}
//                 <div className="text-[11px] space-y-1 mb-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Program:</span>
//                     <span className="font-medium">{student && student?.program}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Email:</span>
//                     <span className="font-medium truncate">{profile && profile?.email}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Valid Until:</span>
//                     <span className="font-medium">
//                       {new Date(new Date().getFullYear() + 1, 11, 31).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>

//                 <Separator className="mb-2" />

//                 <div className="text-center text-[9px] leading-tight text-muted-foreground">
//                   <p>Tap to flip card</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* BACK FACE */}
//           <Card 
//             ref={backRef} 
//             className="absolute inset-0 h-full w-full rounded-md border bg-white shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]"
//           >
//             <CardContent className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
//               {/* Watermark */}
//               <Image
//                 width={100}
//                 height={100}
//                 src={universityLogo}
//                 alt="Logo watermark"
//                 className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
//               />

//               <div className="relative flex flex-col h-full justify-between">
//                 <div className="flex flex-col items-center justify-center flex-1">
//                   <p className="text-[10px] text-muted-foreground mb-1">
//                     Scan for verification
//                   </p>
//                   <Image
//                     width={600}
//                     height={300}
//                     src={barcodeImage}
//                     alt="Student ID Barcode"
//                     className="border rounded-sm bg-white"
//                   />
//                 </div>

//                 <div className="text-center text-[9px] leading-tight text-muted-foreground mt-2">
//                   <p>This card is the property of the University</p>
//                   <p>If found, please return to Student Services</p>
//                   <p className="mt-1">Tap to flip back</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Instructions */}
//       <div className="text-center text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
//         <p className="mb-2">💡 <strong>How to save as PDF:</strong></p>
//         <p>Click "Download PDF" → In the print dialog, select "Save as PDF" or "Microsoft Print to PDF" as your printer destination.</p>
//       </div>
//     </div>
//   );
// };

// export default StudentIDCard;

// import { useRef, useEffect, useState } from "react";
// import Image from "next/image";
// import { Card, CardContent } from "@/src/components/ui/card";
// import { Button } from "@/src/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
// import { Separator } from "@/src/components/ui/seperator";
// import { Badge } from "@/src/components/ui/badge";
// import { Download, Printer, ArrowLeft, Home } from "lucide-react";
// import { generateBarcode } from "../lib/generate-barcode";
// import universityLogo from "../public/images/universityLogo.png";
// import { useRouter } from "next/navigation";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// interface StudentIDCardProps {
//   student: {
//     full_name: string;
//     studentId: string;
//     study_year: number;
//     program: string;
//     avatar?: string;
//   };
//   profile: {
//     email: string;
//     user_id: string;
//   };
// }

// const StudentIDCard = ({ student, profile }: StudentIDCardProps) => {
//   const router = useRouter();
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [barcodeImage, setBarcodeImage] = useState<string>("");
//   const [flipped, setFlipped] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   useEffect(() => {
//     if (student?.studentId) {
//       setBarcodeImage(generateBarcode(student.studentId));
//     }
//   }, [student?.studentId]);

//   const handleDownloadPDF = async () => {
//     if (!cardRef.current) return;
//     setIsDownloading(true);

//     const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("l", "mm", [54, 85.6]); // ID card dimensions
//     pdf.addImage(imgData, "PNG", 0, 0, 85.6, 54);
//     pdf.save(`StudentID-${student.studentId}.pdf`);

//     setIsDownloading(false);
//   };

//   const handleBackToDashboard = () => {
//     router.push("/dashboard");
//   };

//   return profile === null ? (
//     <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//       <p className="text-lg text-muted-foreground">
//         Go back to dashboard and complete your profile
//       </p>
//       <Button
//         onClick={handleBackToDashboard}
//         className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
//       >
//         <Home className="w-4 h-4 mr-2" />
//         Back to Dashboard
//       </Button>
//     </div>
//   ) : (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleBackToDashboard}
//             className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </Button>
//           <h2 className="text-2xl font-bold text-foreground">Student ID Card</h2>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleDownloadPDF}
//             disabled={isDownloading}
//             className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             {isDownloading ? "Preparing PDF..." : "Download PDF"}
//           </Button>
//         </div>
//       </div>

//       {/* Card Container for Download */}
//       <div
//         ref={cardRef}
//         className="relative mx-auto aspect-[1.586/1] w-[442px] cursor-pointer [perspective:1000px]"
//         onClick={() => setFlipped((f) => !f)}
//       >
//         <div
//           className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
//             flipped ? "[transform:rotateY(180deg)]" : ""
//           }`}
//         >
//           {/* FRONT FACE */}
//           <Card className="absolute inset-0 h-full w-full rounded-md border bg-white shadow-md [backface-visibility:hidden]">
//             <CardContent className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
//               <Image
//                 width={100}
//                 height={100}
//                 src={universityLogo}
//                 alt="Logo watermark"
//                 className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
//               />

//               <div className="relative">
//                 <div className="text-center mb-2">
//                   <Image
//                     width={100}
//                     height={100}
//                     src={universityLogo}
//                     alt="University Logo"
//                     className="mx-auto w-14 mb-1"
//                   />
//                   <h3 className="text-base font-bold text-primary uppercase">
//                     UNIVERSITY STUDENT ID
//                   </h3>
//                   <p className="text-xs text-muted-foreground">
//                     Student Identification Card
//                   </p>
//                 </div>

//                 <Separator className="mb-2" />

//                 <div className="flex items-center space-x-3 mb-2">
//                   <Avatar className="w-16 h-16 border">
//                     <AvatarImage src={student.avatar} alt={student?.full_name} />
//                     <AvatarFallback className="text-sm font-semibold">
//                       {student?.full_name
//                         ?.split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-sm">{student.full_name}</h4>
//                     <p className="text-xs text-muted-foreground">
//                       ID: {student?.studentId}
//                     </p>
//                     <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0.5">
//                       Year {student?.study_year}
//                     </Badge>
//                   </div>
//                 </div>

//                 <div className="text-[11px] space-y-1 mb-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Program:</span>
//                     <span className="font-medium">{student?.program}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Email:</span>
//                     <span className="font-medium truncate">{profile?.email}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Valid Until:</span>
//                     <span className="font-medium">
//                       {new Date(new Date().getFullYear() + 1, 11, 31).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>

//                 <Separator className="mb-2" />

//                 <div className="text-center text-[9px] text-muted-foreground">
//                   <p>Tap to flip card</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* BACK FACE */}
//           <Card className="absolute inset-0 h-full w-full rounded-md border bg-white shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
//             <CardContent className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
//               <Image
//                 width={100}
//                 height={100}
//                 src={universityLogo}
//                 alt="Logo watermark"
//                 className="absolute top-1/2 left-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
//               />
//               <div className="flex flex-col items-center justify-center flex-1">
//                 <p className="text-[10px] text-muted-foreground mb-1">
//                   Scan for verification
//                 </p>
//                 <Image
//                   width={600}
//                   height={300}
//                   src={barcodeImage}
//                   alt="Student ID Barcode"
//                   className="border rounded-sm bg-white"
//                 />
//               </div>
//               <div className="text-center text-[9px] text-muted-foreground mt-2">
//                 <p>This card is the property of the University</p>
//                 <p>If found, please return to Student Services</p>
//                 <p className="mt-1">Tap to flip back</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentIDCard;

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/seperator";
import { Badge } from "@/src/components/ui/badge";
import { Download, Printer, ArrowLeft, Home, User as UserIcon } from "lucide-react";
import { generateBarcode } from "../lib/generate-barcode";
import universityLogo from "../../public/images/universityLogo.png";
import cardFrontBg from "../../public/images/card-front-bg.svg";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface StudentIDCardProps {
  student: {
    full_name: string;
    studentId: string;
    study_year: number;
    program: string;
    avatar?: string;
    sex?: string;
    dob?: string;
    stateOfOrigin?: string;
    signature?: string;
    nextOfKin?: string;
    kinAddress?: string;
    kinPhone?: string;
    phone?: string;
    createdAt?: string;
    email?: string;
  };
  profile: {
    email: string;
    user_id: string;
  };
  previewMode?: boolean;
  forceFlip?: boolean;
}

// Sub-component: Card Front Content
const CardFrontContent = ({ student }: { student: StudentIDCardProps['student'] }) => {
  return (
    <div className="absolute inset-0 h-full w-full rounded-[10px] overflow-hidden font-sans select-none bg-white">
      {/* Baked-in Figma Background */}
      <img
        src={typeof cardFrontBg === 'string' ? cardFrontBg : (cardFrontBg as any)?.src || cardFrontBg}
        alt="Card Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />

      <CardContent className="p-0 flex flex-col h-full relative z-10">
        {/* Avatar Overlay: Placed perfectly over the placeholder rectangle in the card SVG */}
        <div
          className="absolute rounded-[7px] overflow-hidden z-20 bg-[#D9D9D9] flex items-center justify-center shadow-inner"
          style={{
            top: "36.36%",
            left: "70.78%",
            width: "24.13%",
            height: "55.45%",
          }}
        >
          {student.avatar ? (
            <img
              src={student.avatar}
              alt="Passport"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
              <UserIcon className="w-6 h-6 opacity-40" />
              <span className="text-[8px] font-bold mt-1 tracking-wider opacity-60 uppercase">Photo</span>
            </div>
          )}
        </div>

        {/* Text Values Overlay: Positioned exactly beside the baked-in labels */}
        <div className="absolute top-[108px] left-[140px] flex flex-col gap-[7px] z-20">
          <span className="text-[11px] font-extrabold text-black tracking-tight">{student.studentId || "—"}</span>
          <span className="text-[11px] font-extrabold text-black tracking-tight truncate max-w-[160px]">{student.full_name || "—"}</span>
          <span className="text-[11px] font-extrabold text-black tracking-tight truncate max-w-[160px]">{student.program || "—"}</span>
          <span className="text-[11px] font-extrabold text-black tracking-tight">
            {student.createdAt ? new Date(student.createdAt).getFullYear() + 4 : new Date().getFullYear() + 4}
          </span>
          <span className="text-[11px] font-extrabold text-black tracking-tight">
            {student.sex || "—"} / {student.dob ? new Date(student.dob).toISOString().split('T')[0] : "—"}
          </span>
          <span className="text-[11px] font-extrabold text-black tracking-tight truncate max-w-[160px]">{student.stateOfOrigin || "—"}</span>

          {/* Signature positioned below the final label */}
          <div className="h-[22px] w-[120px] mt-[1px] relative -left-[10px]">
            {student.signature ? (
              <img src={student.signature} alt="Sign" className="max-h-full object-contain mix-blend-multiply" />
            ) : null}
          </div>
        </div>

        {/* Diagonal Watermark Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] w-[200%] text-center pointer-events-none z-30 opacity-15">
          <span className="text-[32px] font-extrabold text-black whitespace-nowrap tracking-widest uppercase">
            AHMADU BELLO UNIVERSITY
          </span>
        </div>
      </CardContent>
    </div>
  );
};

// Sub-component: Card Back Content
const CardBackContent = ({ student, qrToken, origin }: { student: StudentIDCardProps['student']; qrToken: string; origin: string }) => {
  return (
    <div className="absolute inset-0 h-full w-full rounded-md border bg-[#f8f9fa] overflow-hidden font-sans select-none">
      <CardContent className="p-1.5 flex flex-col h-full relative z-10 border border-black/20 m-1 rounded-sm bg-white">
        <div className="relative h-full flex flex-col justify-between">
          {/* Top Section: Logo & Rules */}
          <div className="flex gap-2">
            <div className="w-[45px] shrink-0 pt-1">
              <Image width={100} height={100} src={universityLogo} alt="University Logo" className="w-full h-auto object-contain opacity-80" />
            </div>
            <div className="flex-1 text-[8.5px] leading-tight text-gray-800 pr-2 pt-1">
              <ol className="list-decimal pl-3 space-y-0.5">
                <li>This card must be the owner's possession at all time</li>
                <li>Loss must be reported to the Chief Security Office or nearest Police station</li>
                <li>Any alteration or erasure would render this card invalid.</li>
              </ol>
            </div>
          </div>

          {/* Middle Section: Contact Info */}
          <div className="flex flex-col mt-3 px-2 text-[10px]">
            <div className="flex">
              <span className="w-[120px] font-bold text-gray-700 uppercase">NEXT OF KIN:</span>
              <span className="font-medium text-gray-900 truncate">{student.nextOfKin || "—"}</span>
            </div>
            <div className="flex mt-1">
              <span className="w-[120px] font-bold text-gray-700 uppercase">ADDRESS:</span>
              <span className="font-medium text-gray-900 truncate">{student.kinAddress || "—"}</span>
            </div>
            <div className="flex mt-1">
              <span className="w-[120px] font-bold text-gray-700 uppercase">PHONE No:</span>
              <span className="font-medium text-gray-900">{student.kinPhone || "—"}</span>
            </div>
            <div className="flex mt-1">
              <span className="w-[120px] font-bold text-gray-700 uppercase">HOLDER'S PHONE No:</span>
              <span className="font-medium text-gray-900">{student.phone || "—"}</span>
            </div>
          </div>

          {/* Bottom Section: Revalidation & Signature */}
          <div className="flex justify-between items-end mt-4 px-2 pb-1">
            {/* Left: Revalidation QR Code */}
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-800 mb-0.5">Revalidation</span>
              <div className="w-[45px] h-[45px] bg-white border border-gray-200 p-0.5 flex items-center justify-center">
                {qrToken ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${origin}/verify?token=${qrToken}`)}`}
                    alt="Validation QR Code"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-[6px] text-gray-400">Loading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Signature */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-800 mb-1">Ag. Chief Security Officer</span>
              <div className="h-[25px] w-[100px] flex items-center justify-center border-b border-transparent">
                <svg viewBox="0 0 100 30" className="w-full h-full opacity-70" preserveAspectRatio="none">
                  <path d="M10,20 Q20,5 30,15 T50,20 T70,10 T90,15" fill="none" stroke="black" strokeWidth="1" />
                  <path d="M25,25 L80,15" fill="none" stroke="black" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

const StudentIDCard = ({ student, profile, forceFlip, previewMode = false }: StudentIDCardProps) => {
  const router = useRouter();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [barcodeImage, setBarcodeImage] = useState<string>("");
  const [flipped, setFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrToken, setQrToken] = useState<string>("preview-valid-signature");
  const [origin, setOrigin] = useState<string>("http://localhost:3000");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (student?.studentId) {
      fetch(`/api/profile/sign-card?studentId=${student.studentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            setQrToken(data.token);
          }
        })
        .catch(err => console.error("Failed to generate QR token", err));
    }
  }, [student?.studentId]);

  useEffect(() => {
    if (forceFlip !== undefined) {
      setFlipped(forceFlip);
    }
  }, [forceFlip]);

  useEffect(() => {
    if (student?.studentId) {
      setBarcodeImage(generateBarcode(student.studentId));
    }
  }, [student?.studentId]);

  // Generic PDF downloader for any given ref
  const downloadPDF = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!ref.current) return;
    setIsDownloading(true);

    const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", [54, 85.6]); // ID card size
    pdf.addImage(imgData, "PNG", 0, 0, 85.6, 54);
    pdf.save(filename);

    setIsDownloading(false);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return profile === null ? (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <p className="text-lg text-muted-foreground">Go back to dashboard and complete your profile</p>
      {!previewMode && (
        <Button onClick={handleBackToDashboard} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
    </div>
  ) : (
    <div className={`space-y-6 ${previewMode ? 'flex justify-center items-center h-full' : ''}`}>
      {/* Header Controls */}
      {!previewMode && (
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToDashboard}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h2 className="text-2xl font-bold text-foreground">Student ID Card</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 font-semibold shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2 text-blue-600" />
              Print Both Sides
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadPDF(frontRef, `StudentID-${student.studentId}-Front.pdf`)}
              disabled={isDownloading}
              className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
            >
              <Download className="w-4 h-4 mr-2 text-green-600" />
              Front PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadPDF(backRef, `StudentID-${student.studentId}-Back.pdf`)}
              disabled={isDownloading}
              className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
            >
              <Download className="w-4 h-4 mr-2 text-green-600" />
              Back PDF
            </Button>
          </div>
        </div>
      )}

      {/* Screen Interactive 3D Flipped Card */}
      <div className="print:hidden">
        <div
          className={`relative mx-auto aspect-[373/220] w-[442px] cursor-pointer [perspective:1000px] ${previewMode ? 'origin-center scale-[0.85]' : ''}`}
          onClick={() => {
            if (forceFlip === undefined) setFlipped((f) => !f);
          }}
        >
          <div
            className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* FRONT FACE (interactive) */}
            <div ref={frontRef} className="absolute inset-0 h-full w-full rounded-[10px] shadow-md [backface-visibility:hidden]">
              <CardFrontContent student={student} />
            </div>

            {/* BACK FACE (interactive) */}
            <div ref={backRef} className="absolute inset-0 h-full w-full rounded-[10px] shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <CardBackContent student={student} qrToken={qrToken} origin={origin} />
            </div>
          </div>
        </div>

        {!previewMode && (
          <p className="text-center text-xs text-muted-foreground mt-3 select-none">
            💡 Click or tap card to flip between Front and Back faces
          </p>
        )}
      </div>

      {/* DEDICATED PRINT SHEET (Visible ONLY in print preview & on printed paper) */}
      <div className="hidden print:flex print:flex-col print:items-center print:w-full print:p-6 print:m-0 print:bg-white">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 15mm;
            }
            body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            /* Hide general layout headers, sidebars, and navs during printing */
            header, nav, aside, footer, button, .print-hidden {
              display: none !important;
            }
          }
        `}} />

        <div className="w-full max-w-[500px] mx-auto text-center mb-6 border-b border-gray-200 pb-3">
          <h1 className="text-base font-bold text-gray-900 tracking-wide uppercase">
            Ahmadu Bello University, Zaria
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Official Digital Student ID Card — Print & Lamination Sheet
          </p>
        </div>

        {/* Both Front & Back displayed neatly on 1 page */}
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Front Card Print Box */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Card Front
            </div>
            <div className="relative aspect-[373/220] w-[400px] rounded-[10px] border border-gray-300 shadow-none overflow-hidden" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <CardFrontContent student={student} />
            </div>
          </div>

          {/* Back Card Print Box */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Card Back
            </div>
            <div className="relative aspect-[373/220] w-[400px] rounded-[10px] border border-gray-300 shadow-none overflow-hidden" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <CardBackContent student={student} qrToken={qrToken} origin={origin} />
            </div>
          </div>
        </div>

        {/* Print Guideline */}
        <div className="mt-8 pt-4 border-t border-dashed border-gray-300 text-center w-full max-w-[400px]">
          <p className="text-[10px] text-gray-400 font-mono">
            ✂ Cut along outer border • Fold back-to-back & laminate
          </p>
        </div>
      </div>

    </div>
  );
};

export default StudentIDCard;
