// ============================================================
// STARDUST HUB - MAIN APPLICATION
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, updatePassword, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, push, update, get, remove, runTransaction } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyC5ufTBjot8i-PJCBkJtUpc50jJcYmzMBQ",
    authDomain: "stardust-hub.firebaseapp.com",
    databaseURL: "https://stardust-hub-default-rtdb.firebaseio.com",
    projectId: "stardust-hub",
    storageBucket: "stardust-hub.firebasestorage.app",
    messagingSenderId: "672339143681",
    appId: "1:672339143681:web:42d7e7f3fd923890aba400",
    measurementId: "G-DZM4TXN2N2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ===== CLOUDINARY =====
const CLOUDINARY = {
    cloudName: 'cbvgkw1a',
    uploadPreset: 'stardust_reels'
};

// ===== EXPORT GLOBALS =====
window.app = app;
window.auth = auth;
window.db = db;
window.CLOUDINARY = CLOUDINARY;

// ============================================================
// DATABASE STATE
// ============================================================
let databaseState = {
    currentUser: { 
        username: "", 
        name: "", 
        uid: "", 
        realFirebaseUID: "", 
        email: "", 
        phone: "", 
        bio: "", 
        pfp: "", 
        profession: "", 
        isPremium: false, 
        premiumTheme: "", 
        premiumFrame: "", 
        premiumFont: "", 
        premiumExpiry: 0, 
        savedPosts: [], 
        savedReels: [],
        followers: {},
        following: {},
        blocked: {},
        isPrivate: false,
        notifications: []
    },
    publications: [], 
    peers: [], 
    followers: {}, 
    following: {}, 
    blocked: {}, 
    chatThreads: {}, 
    activeTargetChatUID: null, 
    activeContextMessageID: null, 
    activeTargetSharePostID: null,
    reels: [], 
    activeReelId: null,
    isUploading: false,
    notifications: [],
    viewedReels: {},
    viewTimers: {},
    reelViewTracked: {},
    collabData: { post: [], reel: [] },
    tagData: { post: [], reel: [] },
    currentPostType: 'post'
};

window.databaseState = databaseState;

// ============================================================
// IMPORTS FROM OTHER MODULES
// ============================================================
import { applyTheme, getStoredTheme, toggleTheme } from './theme.js';
import { showSuccessToast, hideSuccessToast } from './utils.js';
import { 
    renderPosts, loadPosts, createPost, deletePost, likePost, savePost, 
    renderPostComments, addPostComment, deletePostComment, expandPost 
} from './posts.js';
import {
    renderReels, loadReels, createReel, deleteReel, likeReel, saveReel,
    renderReelComments, addReelComment, deleteReelComment, trackReelView,
    setupReelAutoPlay, editReelCaption
} from './reels.js';
import {
    followUser, unfollowUser, blockUser, unblockUser, checkIfBlocked,
    renderFollowers, renderFollowing, renderBlockedUsers
} from './social.js';
import {
    sendMessage, loadChats, renderChatList, openChat, closeChat,
    sendCallChatMessage, renderCallChatMessages, initializePeerConnection,
    startCall, acceptCall, rejectCall, endCall, minimizeCall, restoreCall
} from './chat.js';
import {
    searchUsers, searchPosts, searchHashtags, renderSearchResults
} from './search.js';
import {
    openSettings, openSettingPage, updateProfile, deleteAccount,
    changePassword, resetPassword, updateUsername
} from './settings.js';
import {
    setLanguage, getLanguage, languages, renderLanguageSelector
} from './languages.js';
import {
    activatePremium, applyPremiumSettings, executePremiumTweak,
    openPremiumDashboard
} from './premium.js';
import {
    addNotification, renderNotifications, updateNotificationBadge,
    markAllNotificationsRead, toggleNotificationDropdown
} from './notifications.js';
import {
    openCollaborationModal, confirmCollaboration, renderCollaborators,
    openTagModal, confirmTags, renderTags, endCollaboration
} from './collaboration.js';

// ============================================================
// EXPOSE FUNCTIONS TO WINDOW
// ============================================================
window.databaseState = databaseState;
window.showSuccessToast = showSuccessToast;
window.toggleTheme = toggleTheme;
window.renderPosts = renderPosts;
window.loadPosts = loadPosts;
window.createPost = createPost;
window.deletePost = deletePost;
window.likePost = likePost;
window.savePost = savePost;
window.renderPostComments = renderPostComments;
window.addPostComment = addPostComment;
window.deletePostComment = deletePostComment;
window.expandPost = expandPost;
window.renderReels = renderReels;
window.loadReels = loadReels;
window.createReel = createReel;
window.deleteReel = deleteReel;
window.likeReel = likeReel;
window.saveReel = saveReel;
window.renderReelComments = renderReelComments;
window.addReelComment = addReelComment;
window.deleteReelComment = deleteReelComment;
window.trackReelView = trackReelView;
window.setupReelAutoPlay = setupReelAutoPlay;
window.editReelCaption = editReelCaption;
window.followUser = followUser;
window.unfollowUser = unfollowUser;
window.blockUser = blockUser;
window.unblockUser = unblockUser;
window.checkIfBlocked = checkIfBlocked;
window.renderFollowers = renderFollowers;
window.renderFollowing = renderFollowing;
window.renderBlockedUsers = renderBlockedUsers;
window.sendMessage = sendMessage;
window.loadChats = loadChats;
window.renderChatList = renderChatList;
window.openChat = openChat;
window.closeChat = closeChat;
window.sendCallChatMessage = sendCallChatMessage;
window.renderCallChatMessages = renderCallChatMessages;
window.initializePeerConnection = initializePeerConnection;
window.startCall = startCall;
window.acceptCall = acceptCall;
window.rejectCall = rejectCall;
window.endCall = endCall;
window.minimizeCall = minimizeCall;
window.restoreCall = restoreCall;
window.searchUsers = searchUsers;
window.searchPosts = searchPosts;
window.searchHashtags = searchHashtags;
window.renderSearchResults = renderSearchResults;
window.openSettings = openSettings;
window.openSettingPage = openSettingPage;
window.updateProfile = updateProfile;
window.deleteAccount = deleteAccount;
window.changePassword = changePassword;
window.resetPassword = resetPassword;
window.updateUsername = updateUsername;
window.setLanguage = setLanguage;
window.getLanguage = getLanguage;
window.renderLanguageSelector = renderLanguageSelector;
window.activatePremium = activatePremium;
window.applyPremiumSettings = applyPremiumSettings;
window.executePremiumTweak = executePremiumTweak;
window.openPremiumDashboard = openPremiumDashboard;
window.addNotification = addNotification;
window.renderNotifications = renderNotifications;
window.updateNotificationBadge = updateNotificationBadge;
window.markAllNotificationsRead = markAllNotificationsRead;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.openCollaborationModal = openCollaborationModal;
window.confirmCollaboration = confirmCollaboration;
window.renderCollaborators = renderCollaborators;
window.openTagModal = openTagModal;
window.confirmTags = confirmTags;
window.renderTags = renderTags;
window.endCollaboration = endCollaboration;

// ============================================================
// THEME MANAGEMENT
// ============================================================
function initTheme() {
    const theme = getStoredTheme() || 'light';
    applyTheme(theme);
}
initTheme();

// ============================================================
// NAVIGATION
// ============================================================
window.switchTab = function(tabId) {
    const screens = ['home-screen', 'chat-screen', 'reels-screen', 'search-screen', 'profile-screen'];
    screens.forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById(tabId + '-screen').classList.remove('hidden');
    
    if (tabId === 'reels') {
        document.getElementById('reels-screen').classList.add('-mx-4', '-mt-3');
        loadReels();
    } else {
        document.getElementById('reels-screen').classList.remove('-mx-4', '-mt-3');
    }
    
    if (tabId === 'chat') {
        renderChatList();
    }
    
    if (tabId === 'profile') {
        renderProfile();
    }
    
    // Update nav buttons
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(btn => {
        btn.classList.remove('text-cyan-400', 'text-pink-400');
        btn.classList.add('text-slate-500');
    });
    
    const clickedBtn = event?.currentTarget || document.querySelector(`nav button[onclick*="'${tabId}'"]`);
    if (clickedBtn) {
        if(tabId === 'reels') {
            clickedBtn.classList.remove('text-slate-500');
            clickedBtn.classList.add('text-pink-400');
        } else {
            clickedBtn.classList.remove('text-slate-500');
            clickedBtn.classList.add('text-cyan-400');
        }
    }
};

// ============================================================
// AUTHENTICATION FUNCTIONS
// ============================================================
window.switchAuthView = function(view) {
    const desc = document.getElementById('auth-screen-desc');
    const loginContainer = document.getElementById('login-form-container');
    const signupContainer = document.getElementById('signup-form-container');
    const forgotContainer = document.getElementById('forgot-password-container');
    
    forgotContainer.classList.add('hidden');
    
    if(view === 'signup') {
        loginContainer.classList.add('hidden');
        signupContainer.classList.remove('hidden');
        desc.innerText = "Create Your Professional Stardust Node";
    } else if(view === 'forgot') {
        loginContainer.classList.add('hidden');
        signupContainer.classList.add('hidden');
        forgotContainer.classList.remove('hidden');
        desc.innerText = "Reset Your Account Password";
    } else {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        forgotContainer.classList.add('hidden');
        desc.innerText = "Secure Custom Authentication Terminal";
    }
};

window.switchAuthMethod = function(method) {
    const loginEmail = document.getElementById('login-email-fields');
    const loginPhone = document.getElementById('login-phone-fields');
    const signupEmail = document.getElementById('signup-email-fields');
    const signupPhone = document.getElementById('signup-phone-fields');
    
    // Reset all
    loginEmail.classList.add('hidden');
    loginPhone.classList.add('hidden');
    signupEmail.classList.add('hidden');
    signupPhone.classList.add('hidden');
    
    // Update button styles
    document.querySelectorAll('#login-form-container .flex.gap-2 button, #signup-form-container .flex.gap-2 button').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    });
    
    if (method === 'email') {
        loginEmail.classList.remove('hidden');
        signupEmail.classList.remove('hidden');
        document.getElementById('login-method-email')?.classList.add('bg-blue-600', 'text-white');
        document.getElementById('login-method-email')?.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
        document.getElementById('signup-method-email')?.classList.add('bg-blue-600', 'text-white');
        document.getElementById('signup-method-email')?.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    } else {
        loginPhone.classList.remove('hidden');
        signupPhone.classList.remove('hidden');
        document.getElementById('login-method-phone')?.classList.add('bg-blue-600', 'text-white');
        document.getElementById('login-method-phone')?.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
        document.getElementById('signup-method-phone')?.classList.add('bg-blue-600', 'text-white');
        document.getElementById('signup-method-phone')?.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
    }
};

window.handleCustomSystemLogin = function() {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const phone = document.getElementById('login-phone').value.trim();
    
    // Check if using phone login
    if (phone) {
        // Phone login flow
        window.phoneLogin(phone);
        return;
    }
    
    if(!identifier || !password) {
        showSuccessToast('Error', 'Please enter all credentials.', '❌');
        return;
    }
    
    document.getElementById('btn-text-login').classList.add('hidden');
    document.getElementById('btn-spinner-login').classList.remove('hidden');
    
    // Check if identifier is email or username
    if(identifier.includes('@')) {
        executeFirebaseSignIn(identifier, password);
    } else {
        // Search for username
        onValue(ref(db, 'users'), (snapshot) => {
            const data = snapshot.val();
            let targetEmail = null;
            if(data) {
                const targetUserNode = Object.values(data).find(p => p.username === identifier);
                if(targetUserNode && targetUserNode.email) {
                    targetEmail = targetUserNode.email;
                }
            }
            if(targetEmail) {
                executeFirebaseSignIn(targetEmail, password);
            } else {
                showSuccessToast('Error', 'Username not found.', '❌');
                document.getElementById('btn-text-login').classList.remove('hidden');
                document.getElementById('btn-spinner-login').classList.add('hidden');
            }
        }, { onlyOnce: true });
    }
};

function executeFirebaseSignIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            onValue(ref(db, 'users'), (snapshot) => {
                const data = snapshot.val();
                if(data) {
                    const mappedNode = Object.values(data).find(p => p.realFirebaseUID === userCredential.user.uid);
                    if(mappedNode) {
                        databaseState.currentUser = mappedNode;
                        if(!databaseState.currentUser.savedPosts) databaseState.currentUser.savedPosts = [];
                        if(!databaseState.currentUser.savedReels) databaseState.currentUser.savedReels = [];
                        if(!databaseState.currentUser.notifications) databaseState.currentUser.notifications = [];
                        if(!databaseState.currentUser.followers) databaseState.currentUser.followers = {};
                        if(!databaseState.currentUser.following) databaseState.currentUser.following = {};
                        if(!databaseState.currentUser.blocked) databaseState.currentUser.blocked = {};
                        if(!databaseState.viewedReels) databaseState.viewedReels = {};
                        if(!databaseState.reelViewTracked) databaseState.reelViewTracked = {};
                        
                        document.getElementById('loading-screen').classList.add('hidden');
                        document.getElementById('login-screen').classList.add('hidden');
                        document.getElementById('app-layout').classList.remove('hidden');
                        
                        initApp();
                        saveStateToHardware();
                    }
                }
                document.getElementById('btn-text-login').classList.remove('hidden');
                document.getElementById('btn-spinner-login').classList.add('hidden');
            }, { onlyOnce: true });
        })
        .catch((error) => {
            showSuccessToast('Error', error.message, '❌');
            document.getElementById('btn-text-login').classList.remove('hidden');
            document.getElementById('btn-spinner-login').classList.add('hidden');
        });
}

window.handleCustomSystemSignup = function() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const name = document.getElementById('signup-name').value.trim();
    const bio = document.getElementById('signup-bio').value.trim();
    const pfpFile = document.getElementById('signup-pfp').files[0];
    const phone = document.getElementById('signup-phone').value.trim();
    
    // Check if using phone signup
    if (phone) {
        window.phoneSignup(phone);
        return;
    }
    
    if(!email || !password || !username || !name) {
        showSuccessToast('Error', 'Please fill all required fields.', '❌');
        return;
    }
    
    // Check if username is available
    onValue(ref(db, 'users'), (snapshot) => {
        const data = snapshot.val();
        if(data) {
            const existing = Object.values(data).find(p => p.username === username);
            if(existing) {
                showSuccessToast('Error', 'Username already taken. Please choose another.', '❌');
                return;
            }
        }
        
        document.getElementById('btn-text-signup').classList.add('hidden');
        document.getElementById('btn-spinner-signup').classList.remove('hidden');
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const assignedUID = generateSixDigitUID();
                const userData = {
                    uid: assignedUID,
                    realFirebaseUID: user.uid,
                    username: username,
                    name: name,
                    email: user.email,
                    phone: phone || '',
                    bio: bio || '',
                    pfp: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    profession: '',
                    isPremium: false,
                    premiumTheme: '',
                    premiumFrame: '',
                    premiumFont: '',
                    premiumExpiry: 0,
                    savedPosts: [],
                    savedReels: [],
                    followers: {},
                    following: {},
                    blocked: {},
                    isPrivate: false,
                    notifications: []
                };
                
                databaseState.currentUser = userData;
                
                // Upload profile picture if provided
                if(pfpFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        userData.pfp = e.target.result;
                        set(ref(db, 'users/' + assignedUID), userData).then(() => {
                            finishSignup();
                        });
                    };
                    reader.readAsDataURL(pfpFile);
                } else {
                    set(ref(db, 'users/' + assignedUID), userData).then(() => {
                        finishSignup();
                    });
                }
            })
            .catch((error) => {
                showSuccessToast('Error', error.message, '❌');
                document.getElementById('btn-text-signup').classList.remove('hidden');
                document.getElementById('btn-spinner-signup').classList.add('hidden');
            });
    }, { onlyOnce: true });
};

function finishSignup() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-layout').classList.remove('hidden');
    initApp();
    saveStateToHardware();
    document.getElementById('btn-text-signup').classList.remove('hidden');
    document.getElementById('btn-spinner-signup').classList.add('hidden');
    showSuccessToast('Welcome Aboard!', 'Your Stardust account has been created successfully.', '🚀');
}

window.openForgotPassword = function() {
    switchAuthView('forgot');
};

window.sendPasswordReset = function() {
    const email = document.getElementById('forgot-password-email').value.trim();
    if(!email) {
        showSuccessToast('Error', 'Please enter your email.', '❌');
        return;
    }
    
    document.getElementById('btn-text-reset').classList.add('hidden');
    document.getElementById('btn-spinner-reset').classList.remove('hidden');
    
    sendPasswordResetEmail(auth, email)
        .then(() => {
            showSuccessToast('Email Sent!', 'Password reset link sent to your email.', '📧');
            document.getElementById('btn-text-reset').classList.remove('hidden');
            document.getElementById('btn-spinner-reset').classList.add('hidden');
            switchAuthView('login');
        })
        .catch((error) => {
            showSuccessToast('Error', error.message, '❌');
            document.getElementById('btn-text-reset').classList.remove('hidden');
            document.getElementById('btn-spinner-reset').classList.add('hidden');
        });
};

// ============================================================
// PHONE AUTHENTICATION
// ============================================================
let recaptchaVerifier = null;
let confirmationResult = null;

window.phoneLogin = function(phoneNumber) {
    if(!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier('login-phone', {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved
            }
        }, auth);
    }
    
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmation) => {
            confirmationResult = confirmation;
            document.getElementById('otp-verification-section').classList.remove('hidden');
            showSuccessToast('OTP Sent!', 'Please check your phone for the OTP code.', '📱');
        })
        .catch((error) => {
            showSuccessToast('Error', error.message, '❌');
        });
};

window.verifyOTP = function() {
    const otp = document.getElementById('login-otp').value.trim();
    if(!otp || !confirmationResult) {
        showSuccessToast('Error', 'Please enter the OTP code.', '❌');
        return;
    }
    
    confirmationResult.confirm(otp)
        .then((result) => {
            const user = result.user;
            // Find user in database by phone
            onValue(ref(db, 'users'), (snapshot) => {
                const data = snapshot.val();
                if(data) {
                    const mappedNode = Object.values(data).find(p => p.phone === user.phoneNumber);
                    if(mappedNode) {
                        databaseState.currentUser = mappedNode;
                        if(!databaseState.currentUser.savedPosts) databaseState.currentUser.savedPosts = [];
                        if(!databaseState.currentUser.savedReels) databaseState.currentUser.savedReels = [];
                        if(!databaseState.currentUser.notifications) databaseState.currentUser.notifications = [];
                        if(!databaseState.currentUser.followers) databaseState.currentUser.followers = {};
                        if(!databaseState.currentUser.following) databaseState.currentUser.following = {};
                        if(!databaseState.currentUser.blocked) databaseState.currentUser.blocked = {};
                        
                        document.getElementById('loading-screen').classList.add('hidden');
                        document.getElementById('login-screen').classList.add('hidden');
                        document.getElementById('app-layout').classList.remove('hidden');
                        
                        initApp();
                        saveStateToHardware();
                    } else {
                        showSuccessToast('Error', 'No account found with this phone number.', '❌');
                    }
                }
            }, { onlyOnce: true });
        })
        .catch((error) => {
            showSuccessToast('Error', 'Invalid OTP. Please try again.', '❌');
        });
};

window.phoneSignup = function(phoneNumber) {
    if(!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier('signup-phone', {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved
            }
        }, auth);
    }
    
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmation) => {
            confirmationResult = confirmation;
            document.getElementById('signup-otp-section').classList.remove('hidden');
            showSuccessToast('OTP Sent!', 'Please check your phone for the OTP code.', '📱');
        })
        .catch((error) => {
            showSuccessToast('Error', error.message, '❌');
        });
};

window.verifySignupOTP = function() {
    const otp = document.getElementById('signup-otp').value.trim();
    if(!otp || !confirmationResult) {
        showSuccessToast('Error', 'Please enter the OTP code.', '❌');
        return;
    }
    
    const username = document.getElementById('signup-username').value.trim();
    const name = document.getElementById('signup-name').value.trim();
    const bio = document.getElementById('signup-bio').value.trim();
    const pfpFile = document.getElementById('signup-pfp').files[0];
    
    if(!username || !name) {
        showSuccessToast('Error', 'Please fill all required fields.', '❌');
        return;
    }
    
    // Check username availability
    onValue(ref(db, 'users'), (snapshot) => {
        const data = snapshot.val();
        if(data) {
            const existing = Object.values(data).find(p => p.username === username);
            if(existing) {
                showSuccessToast('Error', 'Username already taken.', '❌');
                return;
            }
        }
        
        confirmationResult.confirm(otp)
            .then((result) => {
                const user = result.user;
                const assignedUID = generateSixDigitUID();
                const userData = {
                    uid: assignedUID,
                    realFirebaseUID: user.uid,
                    username: username,
                    name: name,
                    email: user.email || '',
                    phone: user.phoneNumber,
                    bio: bio || '',
                    pfp: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    profession: '',
                    isPremium: false,
                    premiumTheme: '',
                    premiumFrame: '',
                    premiumFont: '',
                    premiumExpiry: 0,
                    savedPosts: [],
                    savedReels: [],
                    followers: {},
                    following: {},
                    blocked: {},
                    isPrivate: false,
                    notifications: []
                };
                
                databaseState.currentUser = userData;
                
                if(pfpFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        userData.pfp = e.target.result;
                        set(ref(db, 'users/' + assignedUID), userData).then(() => {
                            finishSignup();
                        });
                    };
                    reader.readAsDataURL(pfpFile);
                } else {
                    set(ref(db, 'users/' + assignedUID), userData).then(() => {
                        finishSignup();
                    });
                }
            })
            .catch((error) => {
                showSuccessToast('Error', 'Invalid OTP. Please try again.', '❌');
            });
    }, { onlyOnce: true });
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function generateSixDigitUID() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveStateToHardware() {
    localStorage.setItem("STARDUST_CORE_DB_PROD", JSON.stringify(databaseState));
}

function recoverStateFromHardware() {
    const raw = localStorage.getItem("STARDUST_CORE_DB_PROD");
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if(parsed.currentUser) databaseState.currentUser = parsed.currentUser;
            if(parsed.notifications) databaseState.notifications = parsed.notifications;
            if(parsed.viewedReels) databaseState.viewedReels = parsed.viewedReels;
            if(parsed.reelViewTracked) databaseState.reelViewTracked = parsed.reelViewTracked;
            if(parsed.collabData) databaseState.collabData = parsed.collabData;
            if(parsed.tagData) databaseState.tagData = parsed.tagData;
        } catch(e){}
    }
}

window.saveStateToHardware = saveStateToHardware;
window.recoverStateFromHardware = recoverStateFromHardware;

// ============================================================
// OPEN/CLOSE MODALS
// ============================================================
window.openModal = function(id) { 
    document.getElementById(id).classList.remove('hidden');
};

window.closeModal = function(id) { 
    document.getElementById(id).classList.add('hidden');
};

window.toggleElement = function(id) {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('hidden');
};

window.closeElement = function(id) {
    const el = document.getElementById(id);
    if(el) el.classList.add('hidden');
};

// ============================================================
// POST TAB SWITCHING
// ============================================================
window.switchPostTab = function(tab) {
    databaseState.currentPostType = tab;
    const postTab = document.getElementById('post-tab-post');
    const reelTab = document.getElementById('post-tab-reel');
    const postArea = document.getElementById('post-content-area');
    const reelArea = document.getElementById('reel-content-area');

    if(tab === 'post') {
        postTab.classList.add('active');
        reelTab.classList.remove('active');
        postArea.classList.remove('hidden');
        reelArea.classList.add('hidden');
    } else {
        reelTab.classList.add('active');
        postTab.classList.remove('active');
        reelArea.classList.remove('hidden');
        postArea.classList.add('hidden');
    }
};

// ============================================================
// PROFILE VIEW
// ============================================================
window.toggleProfileView = function(view) {
    const postsTab = document.getElementById('prof-tab-posts');
    const reelsTab = document.getElementById('prof-tab-reels');
    const friendsTab = document.getElementById('prof-tab-friends');
    const postsContainer = document.getElementById('profile-posts-view-container');
    const reelsContainer = document.getElementById('profile-reels-view-container');
    const friendsContainer = document.getElementById('profile-friends-view-container');

    [postsTab, reelsTab, friendsTab].forEach(tab => {
        tab.classList.remove('active');
    });
    [postsContainer, reelsContainer, friendsContainer].forEach(container => {
        container.classList.add('hidden');
    });

    if(view === 'posts') {
        postsTab.classList.add('active');
        postsContainer.classList.remove('hidden');
    } else if(view === 'reels') {
        reelsTab.classList.add('active');
        reelsContainer.classList.remove('hidden');
        renderProfileReels();
    } else {
        friendsTab.classList.add('active');
        friendsContainer.classList.remove('hidden');
        renderFollowers();
        renderFollowing();
    }
};

// ============================================================
// APP INITIALIZATION
// ============================================================
function initApp() {
    // Load all data
    loadPosts();
    loadReels();
    loadChats();
    renderProfile();
    renderNotifications();
    updateNotificationBadge();
    renderChatList();
    
    // Apply premium settings if applicable
    if (databaseState.currentUser.isPremium) {
        applyPremiumSettings(databaseState.currentUser);
    }
    
    // Initialize peer connection for calls
    initializePeerConnection(databaseState.currentUser.uid);
    
    // Setup listeners
    setupListeners();
    
    // Check premium expiry
    checkPremiumExpiry();
}

function setupListeners() {
    const myUID = databaseState.currentUser.uid;
    
    // Listen for users
    onValue(ref(db, 'users'), (snap) => {
        const data = snap.val();
        databaseState.peers = data ? Object.values(data) : [];
        if(data && data[myUID]) {
            databaseState.currentUser = data[myUID];
            if(!databaseState.currentUser.savedPosts) databaseState.currentUser.savedPosts = [];
            if(!databaseState.currentUser.savedReels) databaseState.currentUser.savedReels = [];
            if(!databaseState.currentUser.notifications) databaseState.currentUser.notifications = [];
            if(!databaseState.currentUser.followers) databaseState.currentUser.followers = {};
            if(!databaseState.currentUser.following) databaseState.currentUser.following = {};
            if(!databaseState.currentUser.blocked) databaseState.currentUser.blocked = {};
            if(!databaseState.reelViewTracked) databaseState.reelViewTracked = {};
            renderProfile();
            if (databaseState.currentUser.isPremium) {
                applyPremiumSettings(databaseState.currentUser);
            }
        }
        renderChatList();
    });
    
    // Listen for friendships
    onValue(ref(db, 'friendships'), (snap) => {
        databaseState.friendships = snap.val() || {};
        renderChatList();
    });
    
    // Listen for chats
    onValue(ref(db, 'chats'), (snap) => {
        databaseState.chatThreads = snap.val() || {};
        updateUnseenBadge();
        renderChatList();
        if(databaseState.activeTargetChatUID) {
            renderActiveChatLiveStream(databaseState.activeTargetChatUID);
        }
    });
}

function checkPremiumExpiry() {
    if (databaseState.currentUser.isPremium && databaseState.currentUser.premiumExpiry) {
        const now = Date.now();
        if (now > databaseState.currentUser.premiumExpiry) {
            update(ref(db, 'users/' + databaseState.currentUser.uid), {
                isPremium: false,
                premiumTheme: '',
                premiumFrame: '',
                premiumFont: ''
            }).then(() => {
                databaseState.currentUser.isPremium = false;
                databaseState.currentUser.premiumTheme = '';
                databaseState.currentUser.premiumFrame = '';
                databaseState.currentUser.premiumFont = '';
                applyPremiumSettings(databaseState.currentUser);
                saveStateToHardware();
            });
        }
    }
}

// ============================================================
// RENDER PROFILE
// ============================================================
function renderProfile() {
    const user = databaseState.currentUser;
    document.getElementById('profile-display-name').innerText = user.name;
    document.getElementById('profile-display-username').innerText = '@' + (user.username || user.uid);
    document.getElementById('profile-display-bio').innerText = user.bio || 'No bio yet.';
    if(user.pfp) {
        document.getElementById('profile-display-avatar').src = user.pfp;
    }
    
    const profBadge = document.getElementById('profile-display-profession');
    if(user.profession) {
        profBadge.innerText = user.profession;
        profBadge.classList.remove('hidden');
    } else {
        profBadge.classList.add('hidden');
    }
    
    // Counts
    const followersCount = user.followers ? Object.keys(user.followers).length : 0;
    const followingCount = user.following ? Object.keys(user.following).length : 0;
    const postsCount = databaseState.publications.filter(p => p.authorUID === user.uid).length;
    
    document.getElementById('profile-post-count').innerText = postsCount;
    document.getElementById('profile-follower-count').innerText = followersCount;
    document.getElementById('profile-following-count').innerText = followingCount;
    
    if (user.isPremium) {
        applyPremiumSettings(user);
    }
}

// ============================================================
// UNSEEN BADGE
// ============================================================
function updateUnseenBadge() {
    let totalUnseen = 0;
    const myUID = databaseState.currentUser.uid;
    Object.keys(databaseState.chatThreads).forEach(threadKey => {
        if(threadKey.includes(myUID)) {
            const messages = databaseState.chatThreads[threadKey];
            Object.values(messages).forEach(msg => {
                if(msg.sender !== myUID && msg.status !== 'seen') {
                    totalUnseen++;
                }
            });
        }
    });
    const badge = document.getElementById('global-unseen-badge');
    if(totalUnseen > 0) {
        badge.innerText = totalUnseen;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// ============================================================
// AUTH STATE
// ============================================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        onValue(ref(db, 'users'), (snapshot) => {
            const data = snapshot.val();
            if(data) {
                const mappedNode = Object.values(data).find(p => p.realFirebaseUID === user.uid);
                if(mappedNode) {
                    databaseState.currentUser = mappedNode;
                    if(!databaseState.currentUser.savedPosts) databaseState.currentUser.savedPosts = [];
                    if(!databaseState.currentUser.savedReels) databaseState.currentUser.savedReels = [];
                    if(!databaseState.currentUser.notifications) databaseState.currentUser.notifications = [];
                    if(!databaseState.currentUser.followers) databaseState.currentUser.followers = {};
                    if(!databaseState.currentUser.following) databaseState.currentUser.following = {};
                    if(!databaseState.currentUser.blocked) databaseState.currentUser.blocked = {};
                    
                    document.getElementById('loading-screen').classList.add('hidden');
                    document.getElementById('login-screen').classList.add('hidden');
                    document.getElementById('app-layout').classList.remove('hidden');
                    
                    initApp();
                    saveStateToHardware();
                }
            }
        }, { onlyOnce: true });
    } else {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('app-layout').classList.add('hidden');
    }
});

// ============================================================
// LOGOUT
// ============================================================
window.executeLogout = function() {
    signOut(auth).then(() => {
        localStorage.removeItem("STARDUST_CORE_DB_PROD");
        if(window.peerInstance) window.peerInstance.destroy();
        location.reload();
    });
};

// ============================================================
// INITIALIZATION
// ============================================================
recoverStateFromHardware();

console.log('🚀 Stardust Hub - Complete Social Media Platform');
console.log('✅ All features implemented');
console.log('🎉 Your social media is now COMPLETE!');
