import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import universityLogo from "../../public/images/universityLogo.png";

export default function VerifyCardPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [student, setStudent] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!token || typeof token !== "string") {
      setStatus('invalid');
      setErrorMsg("Missing or invalid token.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (data.valid) {
          setStudent(data.student);
          setStatus('valid');
        } else {
          setErrorMsg(data.error || "Verification failed");
          setStatus('invalid');
        }
      } catch (err) {
        setErrorMsg("Network error occurred during verification.");
        setStatus('invalid');
      }
    };

    verifyToken();
  }, [router.isReady, token]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pt-12">
      <div className="mb-6 flex flex-col items-center">
        <Image src={universityLogo} alt="Logo" width={80} height={80} className="mb-4" />
        <h1 className="text-xl font-bold text-gray-800 uppercase text-center">
          Ahmadu Bello University<br/>ID Card Verification
        </h1>
      </div>

      <Card className="w-full max-w-md shadow-xl overflow-hidden border-0">
        {status === 'loading' && (
          <CardContent className="p-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-medium">Verifying Cryptographic Signature...</p>
          </CardContent>
        )}

        {status === 'invalid' && (
          <div className="bg-red-50 p-8 flex flex-col items-center text-center">
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
            <h2 className="text-3xl font-black text-red-600 uppercase mb-2">Invalid Card</h2>
            <p className="text-red-800 font-medium">{errorMsg}</p>
            <p className="text-sm text-red-600 mt-4 px-4">
              This ID card is either counterfeit or the QR code has been tampered with. Confiscate immediately.
            </p>
          </div>
        )}

        {status === 'valid' && student && (
          <div>
            <div className="bg-green-500 p-6 flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-white mb-2" />
              <h2 className="text-3xl font-black text-white uppercase tracking-wider">Valid ID</h2>
            </div>
            
            <CardContent className="p-6 bg-white">
              <div className="flex flex-col items-center">
                <div className="w-[150px] h-[150px] rounded-xl overflow-hidden border-4 border-green-500 shadow-md mb-4 bg-gray-100 relative">
                  {student.avatar ? (
                    <img src={student.avatar} alt="Live Passport" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">{student.full_name}</h3>
                <p className="text-lg font-semibold text-blue-600 mb-4">{student.studentId}</p>

                <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Program</span>
                    <span className="text-gray-900 font-semibold">{student.program}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-500 font-medium">Status</span>
                    {student.verificationStatus === 'approved' ? (
                      <span className="text-green-600 font-bold uppercase">Active</span>
                    ) : (
                      <span className="text-orange-500 font-bold uppercase">{student.verificationStatus || 'Pending'}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        )}
      </Card>
      
      <p className="mt-8 text-xs text-gray-400 text-center">
        Powered by Advanced Cryptographic Verification<br/>
        Any mismatch between the photo on this screen and the physical card indicates a forgery.
      </p>
    </div>
  );
}
