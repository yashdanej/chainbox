import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UploadFile from "./artifacts/contracts/Upload.sol/Upload.json";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  Mail,
  ExternalLink,
  ArrowRight,
  X,
  Info,
  Check,
  Shield,
  Timer,
  FileText,
  Image,
  FileVideo,
  Music,
  Folder,
  Plus,
  Copy,
  AlertTriangle,
  Network,
  Wifi,
  WifiOff,
  Smartphone,
  Radio,
  Globe,
  Zap,
  ArrowDown,
  ArrowUp,
  SplitSquareHorizontal,
  Lock,
  Calendar,
  Download,
  Eye,
  Key,
  Link2,
  RefreshCw,
  Loader,
  ArrowLeft,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import axios from "axios";
import { API_KEY, API_SECRET, CONTRACT_ABI, CONTRACT_ADDRESS, JWT, PINATA_GATEWAY_URL } from "./data";
import { PinataSDK } from "pinata";
import { use } from "react";

const pinata = new PinataSDK({
  pinataJwt: JWT,
  pinataGateway: PINATA_GATEWAY_URL,
});

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [link, setLink] = useState("");
  const [data, setData] = useState("");
  const [accessAddress, setAccessAddress] = useState("");
  const [newAccess, setNewAccess] = useState("");
  const [accessList, setAccessList] = useState([]);
  useEffect(() => {
    console.log("datadata", data);
  }, [data]);
  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image className="text-blue-400" />;
    if (type.startsWith("video/"))
      return <FileVideo className="text-purple-400" />;
    if (type.startsWith("audio/")) return <Music className="text-green-400" />;
    if (type.includes("pdf")) return <FileText className="text-[#da4f25]" />;
    return <Folder className="text-gray-400" />;
  };
  const formatSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const ConnectWallet = async (provider) => {
    if (provider) {
      window.ethereum.on("accountsChanged", (accounts) => {
        window.location.reload();
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      let contractAddress = CONTRACT_ADDRESS;

      const contract = new ethers.Contract(
        contractAddress,
        // UploadFile.abi,
        CONTRACT_ABI,
        signer
      );
      setContract(contract);
      setProvider(provider);
    } else {
      alert("Please install MetaMask or another Web3 provider.");
    }
  };

  useEffect(() => {
    let ethProvider;
    let contractAddress = CONTRACT_ADDRESS;

    const connectWallet = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }

        ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);

        await ethProvider.send("eth_requestAccounts", []);
        const signer = ethProvider.getSigner();
        setSigner(signer);

        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);
        console.log("accountAddress", accountAddress);

        const contractInstance = new ethers.Contract(
          contractAddress,
          // UploadFile.abi,
          CONTRACT_ABI,
          signer
        );
        setContract(contractInstance);

        console.log("Connected network:", await ethProvider.getNetwork());
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
        setIsOwner(false);
        setSigner(null);
        return;
      }

      try {
        const updatedProvider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const updatedSigner = updatedProvider.getSigner();
        setSigner(updatedSigner);
        setProvider(updatedProvider);

        const accountAddress = await updatedSigner.getAddress();
        setAccount(accountAddress);

        const updatedContract = new ethers.Contract(
          contractAddress,
          // UploadFile.abi,
          CONTRACT_ABI,
          updatedSigner
        );
        setContract(updatedContract);
      } catch (error) {
        console.error("Error handling account change:", error);
      }
    };

    const handleChainChanged = () => {
      console.log("Chain changed. Reloading...");
      window.location.reload();
    };

    connectWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);
  // App mode state (upload or download)
  const [mode, setMode] = useState("upload"); // 'upload' or 'download'

  // Main state for upload flow
  const [step, setStep] = useState("upload");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [transferType, setTransferType] = useState("email");
  const [email, setEmail] = useState({
    sender: "",
    recipient: "",
    message: "",
  });
  useEffect(() => {
    console.log("files", files);
  }, [files]);
  // Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fromSecurity, setFromSecurity] = useState(false);

  // Security and network state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isCopied, setIsCopied] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    password: "",
    expiryDays: 7,
    maxDownloads: 0,
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Transfer details received from server
  const [transferDetails, setTransferDetails] = useState({
    link: "",
    expiryDate: "",
    hasPassword: false,
    maxDownloads: 0,
  });

  // References
  const fileInputRef = useRef(null);
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  const handleFileSelection = (selectedFiles) => {
    console.log("selectedFiles", selectedFiles);
    setFiles(selectedFiles[0]);
    setStep("transfer-options");
  };

  const handleTransferStart = useCallback(() => {
    setModalOpen(true);
  }, [transferType, email, fromSecurity]);

  // Error message display
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-white my-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  };

  // Drag and Drop Handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelection(e.dataTransfer.files);
    },
    [handleFileSelection]
  );

  const handleTransfer = async () => {
    if (!files) {
      alert("Select a file to upload");
      return;
    }
    setIsLoading(true);
    try {
      setUploadStatus("Uploading file...");

      const upload = await pinata.upload.public.file(files);
      console.log("upload", upload);

      if (upload && upload.cid) {
        setUploadStatus("File uploaded successfully!");

        // Construct IPFS gateway link
        const ipfsLink = `${PINATA_GATEWAY_URL}/ipfs/${upload.cid}`;
        console.log("ipfsLink", ipfsLink);
        const tx = await contract.add(account, ipfsLink);
        await tx.wait();
        setLink(ipfsLink);
        setShowSuccessModal(true);
        setTransferDetails({
          link: ipfsLink,
        });
        setStep("upload");
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (error) {
      setUploadStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
      alert(
        `Error uploading file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareAccess = async () => {
    setIsLoading(true);
    try {
      if (!newAccess) {
        setError("Please enter an address to give access");
        return;
      }
      console.log("newAccess", newAccess);

      const tx = await contract.allow(newAccess);
      await tx.wait();
      console.log("Access shared successfully");
      setShowSuccessModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sharing access:", error);
      setError("Failed to share access. Please try again.");
      setIsLoading(false);
    } finally {
      setModalOpen(false);
    }
  };

  const handleDisallow = async (address) => {
    console.log("Removing access for address:", address);

    if (!ethers.utils.isAddress(address)) {
      alert("Invalid Ethereum address.");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.disallow(address);
      await tx.wait();
      console.log("Access removed successfully");
      setAccessList(accessList.filter((item) => item.user !== address));
      alert(`Access removed for ${address}`);
    } catch (error) {
      console.error("Error removing access:", error);
      alert("Failed to remove access. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getData = async () => {
    let dataArray;
    if (accessAddress) {
      dataArray = await contract.display(accessAddress);
      console.log("dataArray", dataArray);
    } else {
      dataArray = await contract.display(account);
      console.log("dataArray", dataArray);
    }
    const isEmpty = Object.keys(dataArray).length === 0;
    console.log("isEmpty", isEmpty);
    
    if (isEmpty) {
      setData("No data found for this address");
    } else {
      setData(dataArray);
      console.log("Data retrieved successfully");
    }
    setStep("display");
    console.log("dataArray", dataArray);
  };

  const Share = async () => {
    setModalOpen(true);
  };

  const getAccessList = async () => {
    setIsLoading(true);
    try {
      const accessList = await contract.shareAccess();
      console.log("Access list retrieved successfully");
      console.log("Access List:", accessList);
      setAccessList(accessList);
      // Process the access list as needed
    } catch (error) {
      console.error("Error fetching access list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      getAccessList();
    }
  }, [modalOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transferDetails.link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Render the correct content based on step
  const renderContent = () => {
    switch (step) {
      case "upload":
        return (
          <div
            className="group bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center transition-all duration-300 
              border border-white/10 hover:bg-white/10"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              borderColor: isDragging
                ? "rgba(249, 115, 22, 0.5)"
                : "rgba(255, 255, 255, 0.1)",
              borderStyle: isDragging ? "dashed" : "solid",
              borderWidth: isDragging ? "2px" : "1px",
              background: isDragging
                ? "rgba(249, 115, 22, 0.1)"
                : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Upload className="w-20 h-20 mx-auto mb-8 text-[#E13300]/80 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-3xl font-light mb-6">Drop your files here</h2>
            <p className="text-lg text-white/60 mb-8">or</p>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => handleFileSelection(e.target.files)}
            />
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                } else {
                  console.warn("fileInputRef is null");
                }
              }}
              className="px-8 py-3 bg-[#E13300] text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
            >
              Choose a file
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="py-6 space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left text-white space-y-2">
                <p className="text-sm text-white/70">
                  📥 <span className="font-medium text-white">Get Data:</span>{" "}
                  Click the{" "}
                  <span className="font-semibold text-orange-400">
                    Get Data
                  </span>{" "}
                  button to view your own uploaded files.
                </p>
                <p className="text-sm text-white/70">
                  🔗{" "}
                  <span className="font-medium text-white">
                    Access Other User:
                  </span>{" "}
                  Enter another user's public address to access their files (if
                  permission is granted).
                </p>

                <p className="text-sm text-white/70">
                  🔗{" "}
                  <span className="font-medium text-white">
                    Share:
                  </span>{" "}
                  Click the{" "}
                  <span className="font-semibold text-orange-400">Share</span>{" "}
                  button to share your files with others.
                </p>

                 <p className="text-sm text-white/70">
                  🔗{" "}
                  <span className="font-medium text-white">
                    Accessed Users:
                  </span>{" "}
                  View the list of users who have access to your files.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter public address to access shared files"
                  value={accessAddress}
                  onChange={(e) => setAccessAddress(e.target.value)}
                  className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg 
        text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none w-full"
                />
                <button
                  onClick={getData}
                  className="px-6 py-3 bg-[#E13300] text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Get Data
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={Share}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {renderError()}
          </div>
        );

      case "display":
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light mb-4 ">Uploaded Files</h2>
              <h2 className="text-xl mb-4" onClick={() => setStep("upload")}>
                <ArrowLeft />
              </h2>
            </div>
            {typeof data !== "string" ? (
              data?.map((item, index) => {
                console.log("item", item);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/10 rounded-lg mb-2 hover:bg-white/20 transition-colors"
                  >
                    <a target="_blank" href={`https://${item}`}>
                      <img
                        src={`https://${item}`}
                        alt="uploaded"
                        className="w-full h-auto"
                      />
                    </a>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-red-400">No files found</div>
            )}
          </div>
        );

      case "transfer-options":
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            {/* File Support Info */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-light">Selected Files</h2>
                <div className="text-sm text-white/60">
                  {files.length} files •
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileSelection(e.target.files)}
              />
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <Image className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                  <div className="text-xs">Images</div>
                  <div className="text-xs text-white/40">.jpg .png .gif</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <FileText className="w-5 h-5 mx-auto mb-2 text-[#da4f25]" />
                  <div className="text-xs">Documents</div>
                  <div className="text-xs text-white/40">.pdf .doc .txt</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <FileVideo className="w-5 h-5 mx-auto mb-2 text-purple-400" />
                  <div className="text-xs">Videos</div>
                  <div className="text-xs text-white/40">.mp4 .mov</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-center">
                  <Music className="w-5 h-5 mx-auto mb-2 text-green-400" />
                  <div className="text-xs">Audio</div>
                  <div className="text-xs text-white/40">.mp3 .wav</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center">
                      {getFileIcon(files.type)}
                    </div>
                    <div>
                      <div className="text-sm">{files.name}</div>
                      <div className="text-xs text-white/40">
                        {formatSize(files.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newFiles = [...files];
                      newFiles.splice(index, 1);
                      setFiles(newFiles);
                      if (newFiles.length === 0) setStep("upload");
                    }}
                    className="p-2 text-white/40 hover:text-white/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* optional */}
            {renderError()}

            {/* Action Button */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={handleTransfer}
                disabled={isLoading || error}
                className={`w-full p-4 bg-[#E13300] text-white rounded-full hover:bg-orange-600 
                  transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Transfer {files.length} file{files.length !== 1 ? "s" : ""}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  // OTP Verification Modal
  const renderOtpModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="bg-black/90 border border-white/10 text-white p-6 w-full max-w-lg rounded-2xl space-y-6">
          <input
            type="text"
            value={newAccess}
            onChange={(e) => setNewAccess(e.target.value)}
            placeholder="Wallet address to give access"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg 
        text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none"
          />

          <div>
            <label className="block text-sm text-white/70 mb-3">
              Existing Access List
            </label>
            {isLoading ? (
              <p className="text-white/50 text-sm">Loading...</p>
            ) : accessList?.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {accessList?.map((access, index) => {
                  if (access.access) {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg"
                      >
                        <span className="text-white/80 text-sm">
                          {access[0]?.slice(0, 6)}...
                        </span>
                        <button
                          onClick={() => handleDisallow(access.user)}
                          disabled={isLoading}
                          className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
                        >
                          Disallow
                        </button>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <p className="text-white/50 text-sm">No access addresses found</p>
            )}
          </div>

          {renderError()}

          <div className="flex gap-4">
            <button
              onClick={() => setModalOpen(false)}
              disabled={isLoading}
              className="flex-1 py-3 text-white border border-white/10 rounded-full 
          hover:bg-white/10 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleShareAccess}
              disabled={isLoading}
              className="flex-1 py-3 bg-[#E13300] text-white rounded-full 
          hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Give Access"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Success Modal
  const renderSuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black/90 border border-white/10 text-white p-6 max-w-md mx-auto rounded-2xl">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#E13300]/20 
              flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-[#E13300]" />
            </div>

            <h3 className="text-2xl font-light mb-2">Transfer Complete!</h3>
            <p className="text-white/60 mb-6">
              Your files are ready to be shared
            </p>

            {/* Transfer Link */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  value={transferDetails.link}
                  readOnly
                  className="bg-transparent flex-1 outline-none text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Details */}
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center justify-center gap-2">
                <Timer className="w-4 h-4" />
                <span>Expires in {securitySettings.expiryDays} days</span>
              </div>

              {transferDetails.hasPassword && (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Password protected</span>
                </div>
              )}

              {transferDetails.maxDownloads > 0 && (
                <div className="flex items-center justify-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  <span>
                    Limited to {transferDetails.maxDownloads} downloads
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 px-6 py-3 bg-[#E13300] text-white rounded-full hover:bg-orange-600 
                transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col">
        <Navbar ConnectWallet={ConnectWallet} account={account} />

        {/* Gradient and Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-black to-black pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-[#E13300]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-[#E13300]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Main Content Container */}
        <div className="relative flex-1 flex flex-col">
          {/* Main Content Area */}
          <main className="flex-1 flex items-center justify-center p-4 mt-8">
            <div className="w-full max-w-xl sm:z-10">
              {mode === "upload" ? renderContent() : null}
            </div>
          </main>

          <div className="mt-5">
            <Footer />
          </div>
        </div>

        {/* Modals */}
        {renderOtpModal()}
        {renderSuccessModal()}
      </div>
    </>
  );
}

export default App;
