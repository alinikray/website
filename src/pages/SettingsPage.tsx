import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Monitor, Globe, Crown, Lock,
  Eye, EyeOff, ChevronRight, Check, Mail, Smartphone, Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'account' | 'profile' | 'notifications' | 'content' | 'privacy' | 'appearance';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'account', label: 'حساب کاربری', icon: User },
  { id: 'profile', label: 'پروفایل', icon: Monitor },
  { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
  { id: 'content', label: 'تنظیمات محتوا', icon: Globe },
  { id: 'privacy', label: 'حریم خصوصی', icon: Shield },
  { id: 'appearance', label: 'ظاهر', icon: Monitor },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-checked={enabled}
      role="switch"
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-accent-600' : 'bg-dark-700'}`}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-dark-800 last:border-0">
      <div className="flex-1 mr-4">
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [notifs, setNotifs] = useState({
    newReleases: true,
    recommendations: true,
    newsletter: false,
    activityAlerts: true,
    sms: false,
  });
  const [content, setContent] = useState({
    autoplay: true,
    skipIntro: true,
    matureContent: false,
    showSubtitles: true,
    preferredLanguage: 'Persian',
  });
  const [privacy, setPrivacy] = useState({
    watchHistory: true,
    shareActivity: false,
    personalizedAds: false,
    dataCollection: true,
  });
  const [theme, setTheme] = useState<'dark' | 'darker'>('dark');
  const [interfaceLanguage, setInterfaceLanguage] = useState('English');

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleContent = (key: keyof typeof content) =>
    setContent(prev => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key: keyof typeof privacy) =>
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">تنظیمات</h1>
          <p className="text-gray-400">مدیریت حساب و تنظیمات شما</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <aside className="md:w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-accent-600/20 text-accent-400 border border-accent-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
              <div className="pt-2 space-y-1">
                <Link
                  to="/subscription"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-all"
                >
                  <Crown className="w-4 h-4 flex-shrink-0" />
                  ارتقا پلن
                </Link>
                <Link
                  to="/support"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-dark-800 transition-all"
                >
                  <Headphones className="w-4 h-4 flex-shrink-0" />
                  مرکز پشتیبانی
                </Link>
              </div>
            </nav>
          </aside>

          {/* Content panel */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="glass rounded-2xl p-6"
              >
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">حساب کاربری</h2>
                    <div className="space-y-1">
                      <SettingRow label="آدرس ایمیل" description="ali.mohammadi@gmail.com">
                        <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm transition-colors">
                          <Mail className="w-4 h-4" />
                          تغییر
                        </button>
                      </SettingRow>
                      <SettingRow label="رمز عبور" description="آخرین تغییر ۳ ماه پیش">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value="••••••••"
                              readOnly
                              className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-sm text-white w-32"
                            />
                            <button
                              onClick={() => setShowPassword(s => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <button className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                            بروزرسانی
                          </button>
                        </div>
                      </SettingRow>
                      <SettingRow label="شماره موبایل" description="اضافه نشده">
                        <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm transition-colors">
                          <Smartphone className="w-4 h-4" />
                          افزودن
                        </button>
                      </SettingRow>
                      <SettingRow label="احراز هویت دو مرحله‌ای" description="یک لایه امنیتی اضافی اضافه کنید">
                        <button className="flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm transition-colors">
                          <Lock className="w-4 h-4" />
                          فعال‌سازی
                        </button>
                      </SettingRow>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">اشتراک</h3>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                        <div>
                          <p className="text-white font-semibold">پلن رایگان</p>
                          <p className="text-gray-500 text-sm">دسترسی محدود</p>
                        </div>
                        <Link
                          to="/subscription"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg"
                        >
                          <Crown className="w-4 h-4" />
                          ارتقا
                        </Link>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dark-800">
                      <button className="text-red-400 hover:text-red-300 text-sm transition-colors">
                        حذف حساب کاربری
                      </button>
                    </div>
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">پروفایل</h2>
                    <div className="flex items-center gap-5 mb-8 p-4 bg-dark-800/50 rounded-xl">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-bold text-xl">
                        AM
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">علی محمدی</p>
                        <p className="text-gray-500 text-sm">عضو از فروردین ۱۴۰۳</p>
                      </div>
                      <button className="text-accent-400 hover:text-accent-300 text-sm transition-colors">
                        تغییر عکس
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: 'نام کامل', value: 'Ali Mohammadi', placeholder: 'نام کامل شما' },
                        { label: 'نام نمایشی', value: 'Ali M.', placeholder: 'نحوه نمایش شما' },
                        { label: 'بیوگرافی', value: '', placeholder: 'یک بیوگرافی کوتاه درباره خودتان...' },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-sm font-medium text-gray-400 mb-1.5">{field.label}</label>
                          <input
                            type="text"
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                            className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all text-sm"
                          />
                        </div>
                      ))}
                      <button className="flex items-center gap-2 bg-accent-600 hover:bg-accent-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                        <Check className="w-4 h-4" />
                        ذخیره تغییرات
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">اعلان‌ها</h2>
                    <div className="space-y-1">
                      <SettingRow label="انتشارهای جدید" description="هنگام راه‌اندازی فیلم‌ها و سریال‌های جدید اطلاع دریافت کنید">
                        <Toggle enabled={notifs.newReleases} onToggle={() => toggleNotif('newReleases')} />
                      </SettingRow>
                      <SettingRow label="پیشنهادهای شخصی‌سازی‌شده" description="خلاصه هفتگی بر اساس سلیقه شما">
                        <Toggle enabled={notifs.recommendations} onToggle={() => toggleNotif('recommendations')} />
                      </SettingRow>
                      <SettingRow label="هشدارهای فعالیت" description="بروزرسانی لیست تماشا و دعوت‌های تماشای مشترک">
                        <Toggle enabled={notifs.activityAlerts} onToggle={() => toggleNotif('activityAlerts')} />
                      </SettingRow>
                      <SettingRow label="خبرنامه" description="گزیده ماهانه و اخبار پلتفرم">
                        <Toggle enabled={notifs.newsletter} onToggle={() => toggleNotif('newsletter')} />
                      </SettingRow>
                      <SettingRow label="اعلان‌های پیامکی" description="هشدارهای مهم حساب از طریق پیامک">
                        <Toggle enabled={notifs.sms} onToggle={() => toggleNotif('sms')} />
                      </SettingRow>
                    </div>
                  </div>
                )}

                {/* Content Preferences Tab */}
                {activeTab === 'content' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">تنظیمات محتوا</h2>
                    <div className="space-y-1 mb-8">
                      <SettingRow label="پخش خودکار قسمت بعدی" description="قسمت بعدی سریال را به صورت خودکار پخش کن">
                        <Toggle enabled={content.autoplay} onToggle={() => toggleContent('autoplay')} />
                      </SettingRow>
                      <SettingRow label="رد کردن مقدمه" description="کردیت‌های ابتدایی را به صورت خودکار رد کن">
                        <Toggle enabled={content.skipIntro} onToggle={() => toggleContent('skipIntro')} />
                      </SettingRow>
                      <SettingRow label="نمایش زیرنویس به صورت پیش‌فرض" description="زیرنویس را به صورت خودکار نمایش بده">
                        <Toggle enabled={content.showSubtitles} onToggle={() => toggleContent('showSubtitles')} />
                      </SettingRow>
                      <SettingRow label="محتوای بزرگسال" description="نمایش محتوای +۱۸ در مرور">
                        <Toggle enabled={content.matureContent} onToggle={() => toggleContent('matureContent')} />
                      </SettingRow>
                    </div>

                    <div className="pt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">زبان ترجیحی</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['فارسی', 'English', 'العربية', 'Türkçe', 'Français', 'سایر'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setInterfaceLanguage(lang)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              interfaceLanguage === lang
                                ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                                : 'bg-dark-800/50 text-gray-400 hover:text-white border border-dark-700'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">ژانرهای مورد علاقه</h3>
                      <div className="flex flex-wrap gap-2">
                        {['اکشن', 'درام', 'کمدی', 'هیجان‌انگیز', 'رمانتیک', 'علمی‌تخیلی', 'ترسناک', 'مستند'].map(genre => (
                          <button
                            key={genre}
                            className="px-3 py-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white border border-dark-700 hover:border-accent-500/50 text-xs transition-all"
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">حریم خصوصی</h2>
                    <div className="space-y-1 mb-8">
                      <SettingRow label="تاریخچه تماشا" description="تاریخچه بینش شما برای پیشنهادها ذخیره شود">
                        <Toggle enabled={privacy.watchHistory} onToggle={() => togglePrivacy('watchHistory')} />
                      </SettingRow>
                      <SettingRow label="اشتراک‌گذاری فعالیت" description="بگذار دوستان ببینند چه تماشا می‌کنید">
                        <Toggle enabled={privacy.shareActivity} onToggle={() => togglePrivacy('shareActivity')} />
                      </SettingRow>
                      <SettingRow label="تبلیغات شخصی‌سازی‌شده" description="از داده‌های شما برای نمایش تبلیغات مرتبط در پلن رایگان استفاده شود">
                        <Toggle enabled={privacy.personalizedAds} onToggle={() => togglePrivacy('personalizedAds')} />
                      </SettingRow>
                      <SettingRow label="آنالیتیکس استفاده" description="با داده‌های ناشناس به بهبود ما کمک کنید">
                        <Toggle enabled={privacy.dataCollection} onToggle={() => togglePrivacy('dataCollection')} />
                      </SettingRow>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700 text-gray-300 hover:text-white transition-colors text-sm">
                        دانلود اطلاعات من
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700 text-gray-300 hover:text-white transition-colors text-sm">
                        پاک کردن تاریخچه تماشا
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">ظاهر</h2>

                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">تم</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'dark' as const, label: 'تاریک', desc: 'حالت تاریک کلاسیک', bg: 'bg-dark-900' },
                          { id: 'darker' as const, label: 'کاملاً سیاه', desc: 'حداکثر کنتراست', bg: 'bg-black' },
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              theme === t.id ? 'border-accent-500' : 'border-dark-700'
                            }`}
                          >
                            <div className={`w-full h-12 rounded-lg ${t.bg} mb-3 border border-dark-700`} />
                            <p className="text-white font-medium text-sm">{t.label}</p>
                            <p className="text-gray-500 text-xs">{t.desc}</p>
                            {theme === t.id && (
                              <div className="mt-2 flex items-center gap-1 text-accent-400 text-xs">
                                <Check className="w-3 h-3" />
                                فعال
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-dark-800">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">زبان رابط کاربری</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['English', 'فارسی', 'العربية', 'Türkçe'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setInterfaceLanguage(lang)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              interfaceLanguage === lang
                                ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                                : 'bg-dark-800/50 text-gray-400 hover:text-white border border-dark-700'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
