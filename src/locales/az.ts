import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';
import { VALIDATION } from '../constants/validation';

export const az = {
  components: {
    home: {
      intro: {
        title: 'Ödənişlərinizi İzləyin, <1 /> Büdcənizi Tam Nəzarətdə Saxlayın',
        description:
          'PayFlow şəxsi ödənişlərinizi izləmək üçün sadə və effektiv bir platformadır. <1 /> Ödənişlərinizi asanlıqla qeyd edin, indiyə qədər etdiyiniz ödənişləri izləyin və qalan məbləğləri daim nəzarətdə saxlayın.',
      },
    },
    emptyState: {
      default: {
        title: 'Məlumat yoxdur',
        description: 'Burada göstəriləcək məlumat yoxdur.',
      },
    },
    installments: {
      all: {
        pageTitle: 'Bütün Borclar',
        empty: {
          title: 'Ödəniş tapılmadı',
          description: 'Hələ heç bir ödəniş əlavə etməmisiniz.',
        },
      },
      add: {
        pageTitle: 'Ödəniş Əlavə Et',
      },
      edit: {
        pageTitle: 'Ödənişi Redaktə Et',
      },
      card: {
        badge: {
          paid: 'Ödənib',
          active: 'Aktiv',
        },
      },
      details: {
        pageTitle: 'Ödəniş Təfərrüatları',
        label: {
          amount: 'Məbləğ',
          startDate: 'Başlama tarixi',
          createdAt: 'Yaradılıb',
          updatedAt: 'Yenilənib',
        },
      },
    },
    paymentsCard: {
      paid: {
        cardTitle: 'ÖDƏNİB',
        empty: {
          title: 'Hələ ödəmə edilməyib',
        },
      },
      unpaid: {
        cardTitle: 'QALIB',
        empty: {
          title: 'Bütün ödənişlər tamamlanıb',
        },
      },
    },
    filters: {
      pageTitle: 'Ödənişlər',
      cards: {
        overdue: 'GECİKMİŞ',
        current: 'BU AY',
        remaining: 'QALAN',
        paid: 'ÖDƏNMİŞ',
        all: 'HAMISI',
      },
      overdue: {
        pageTitle: 'Gecikmiş Borclar',
        totalLabel: 'ÜMUMİ MƏBLƏĞ',
        empty: {
          title: 'Gecikmiş ödəniş yoxdur',
          description: 'Əvvəlki aylara aid heç bir ödənilməmiş borc yoxdur.',
        },
      },
      current: {
        pageTitle: 'Bu Ayın Borcları',
        totalLabel: 'ÜMUMİ MƏBLƏĞ ({{month}})',
        empty: {
          title: 'Hamısı tamamlandı!',
          description: 'Seçilmiş ay üçün ödənilməmiş borc yoxdur.',
        },
      },
      remaining: {
        pageTitle: 'Qalan Borclar',
        totalLabel: 'ÜMUMİ MƏBLƏĞ',
        empty: {
          title: 'Qalıq ödəniş yoxdur',
          description: 'Bütün gələcək ödənişlər artıq tamamlanıb.',
        },
      },
      paid: {
        pageTitle: 'Ödənmiş Borclar',
        totalLabel: 'ÜMUMİ MƏBLƏĞ',
        empty: {
          title: 'Hələ ödəniş yoxdur',
          description: 'İndiyədək heç bir ödəniş tamamlanmayıb.',
        },
      },
    },
    filteredPaymentsTable: {
      accordionLabel: 'ÖDƏNİŞLƏRƏ BAX',
      tableHeader: {
        date: 'Tarix',
        amount: 'Məbləğ',
      },
    },
    paymentItem: {
      paidLabel: 'Ödənib: {{date}}',
    },
    statsCard: {
      totalLabel: 'TOPLAM BORC:',
      paid: 'ÖDƏNMİŞ',
      remaining: 'QALAN',
    },
    monthlyStats: {
      empty: {
        description: '{{year}} ili üçün borc məlumatı yoxdur.',
      },
    },
    notFound: {
      title: 'Burada görünəcək heç nə yoxdur',
      description:
        'Açmağa çalışdığınız səhifə mövcud deyil. <1 /> Ünvanı səhv daxil etmiş ola bilərsiniz və ya səhifə başqa ünvana köçürülüb.',
      button: 'Məni ana səhifəyə qaytar',
    },
  },
  forms: {
    login: {
      title: '<1>Pay</1><2>Flow</2>-a daxil olun',
      signupPrompt: 'Hesabınız yoxdur?',
      signupLink: 'Qeydiyyatdan keçin',
      fields: {
        username: {
          label: 'İstifadəçi adı',
          placeholder: 'İstifadəçi adınızı daxil edin',
        },
        password: {
          label: 'Şifrə',
          placeholder: 'Şifrənizi daxil edin',
        },
      },
      errors: {
        form: {
          [ERROR_MESSAGES.AUTH.USERNAME_REQUIRED]: 'İstifadəçi adı mütləqdir.',
          [ERROR_MESSAGES.AUTH.USERNAME_MIN_LENGTH]:
            'Ən azı 6 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.USERNAME_MAX_LENGTH]:
            'Ən çoxu 20 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.USERNAME_INVALID]:
            'Yalnız kiçik hərflər və rəqəmlərdən ibarət ola bilər.',

          [ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED]: 'Şifrə mütləqdir.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH]:
            'Ən azı 8 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MAX_LENGTH]:
            'Ən çoxu 20 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.PASSWORD_INVALID]:
            'Ən azı bir hərf və bir rəqəm olmalıdır, boşluq ola bilməz.',
        },
      },
    },
    signup: {
      title: '<1>Pay</1><2>Flow</2> üçün qeydiyyat',
      loginPrompt: 'Artıq hesabınız var?',
      loginLink: 'Daxil olun',
      fields: {
        username: {
          label: 'İstifadəçi adı',
          placeholder: 'İstifadəçi adınızı daxil edin',
        },
        password: {
          label: 'Şifrə',
          placeholder: 'Şifrənizi daxil edin',
        },
        confirmPassword: {
          label: 'Şifrə təsdiqi',
          placeholder: 'Şifrənizi təsdiqləyin',
        },
      },
      errors: {
        form: {
          [ERROR_MESSAGES.AUTH.USERNAME_REQUIRED]: 'İstifadəçi adı mütləqdir.',
          [ERROR_MESSAGES.AUTH.USERNAME_MIN_LENGTH]:
            'Ən azı 6 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.USERNAME_MAX_LENGTH]:
            'Ən çoxu 20 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.USERNAME_INVALID]:
            'Yalnız kiçik hərflər və rəqəmlərdən ibarət ola bilər.',

          [ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED]: 'Şifrə mütləqdir.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH]:
            'Ən azı 8 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.PASSWORD_MAX_LENGTH]:
            'Ən çoxu 20 simvol olmalıdır.',
          [ERROR_MESSAGES.AUTH.PASSWORD_INVALID]:
            'Ən azı bir hərf və bir rəqəm olmalıdır, boşluq ola bilməz.',

          [ERROR_MESSAGES.AUTH.CONFIRM_PASSWORD_REQUIRED]:
            'Təsdiq şifrəsi mütləqdir.',
          [ERROR_MESSAGES.AUTH.CONFIRM_PASSWORD_MATCH]:
            'Şifrələr uyğun gəlmir.',
        },
      },
    },
    installment: {
      fields: {
        title: {
          label: 'Başlıq',
          placeholder: 'Ödəniş başlığını daxil edin',
        },
        amount: {
          label: 'Məbləğ',
          placeholder: 'Ödəniş məbləğini daxil edin',
        },
        startDate: {
          label: 'Başlama tarixi',
          placeholder: 'Başlama tarixini seçin',
        },
        monthCount: {
          label: 'Ayların sayı',
          placeholder: 'Ayların sayını daxil edin',
        },
        monthlyPayments: {
          label: 'Aylıq ödənişlər',
          empty: {
            title: 'Aylıq ödənişlər forma doldurulduqdan sonra görsənəcək.',
          },
          date: {
            placeholder: 'Tarix seçin',
          },
          amount: {
            placeholder: 'Məbləği daxil edin',
          },
        },
      },
      errors: {
        form: {
          [ERROR_MESSAGES.INSTALLMENT.TITLE_REQUIRED]: 'Başlıq mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.TITLE_STRING]:
            'Başlıq mətn tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT
            .TITLE_MIN_LENGTH]: `Ən azı ${VALIDATION.INSTALLMENT.TITLE_MIN_LENGTH} simvol olmalıdır.`,
          [ERROR_MESSAGES.INSTALLMENT
            .TITLE_MAX_LENGTH]: `Ən çox ${VALIDATION.INSTALLMENT.TITLE_MAX_LENGTH} simvol olmalıdır.`,

          [ERROR_MESSAGES.INSTALLMENT.AMOUNT_REQUIRED]: 'Məbləğ mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.AMOUNT_NUMBER]:
            'Məbləğ ədəd tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT
            .AMOUNT_POSITIVE]: `Məbləğ müsbət olmalıdır.`,

          [ERROR_MESSAGES.INSTALLMENT.START_DATE_REQUIRED]:
            'Başlama tarixi mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.START_DATE_STRING]:
            'Başlama tarixi mətn tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT.START_DATE_INVALID]:
            'Başlama tarixi formatı yanlışdır.',

          [ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_REQUIRED]:
            'Ayların sayı mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_NUMBER]:
            'Ayların sayı ədəd tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT.MONTH_COUNT_MIN]:
            'Ən azı {{count}} ay tələb olunur.',

          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_REQUIRED]:
            'Aylıq ödənişlər mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_ARRAY]:
            'Aylıq ödənişlər siyahı tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_COUNT_MISMATCH]:
            'Aylıq ödənişlərin sayı ayların sayına bərabər olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENTS_TOTAL_MISMATCH]:
            'Aylıq ödənişlərin cəmi ({{sum}} ₼) ümumi məbləğə ({{amount}} ₼) bərabər olmalıdır.',

          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_REQUIRED]:
            'Ödəniş tarixi mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_STRING]:
            'Ödəniş tarixi mətn tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_DATE_INVALID]:
            'Ödəniş tarixi formatı yanlışdır.',

          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_REQUIRED]:
            'Ödəniş məbləği mütləqdir.',
          [ERROR_MESSAGES.INSTALLMENT.MONTHLY_PAYMENT_AMOUNT_NUMBER]:
            'Ödəniş məbləği ədəd tipində olmalıdır.',
          [ERROR_MESSAGES.INSTALLMENT
            .MONTHLY_PAYMENT_AMOUNT_POSITIVE]: `Ödəniş məbləği müsbət olmalıdır.`,
        },
      },
    },
  },
  buttons: {
    login: {
      label: 'DAXİL OL',
    },
    logout: {
      label: 'ÇIXIŞ ET',
    },
    signup: {
      label: 'QEYDİYYATDAN KEÇ',
    },
    getStarted: {
      label: 'İNDİ BAŞLA',
    },
    otherProjects: {
      label: 'DİGƏR LAYİHƏLƏRƏ BAX',
    },
    installment: {
      add: {
        label: 'ƏLAVƏ ET',
        tooltip: 'Yeni ödəniş əlavə et',
      },
      save: {
        label: 'YADDA SAXLA',
      },
      edit: {
        label: 'REDAKTƏ ET',
      },
      delete: {
        label: 'SİL',
      },
    },
    payments: {
      label: 'ÖDƏNİŞLƏR',
    },
    menu: {
      label: 'MENYU',
    },
    completePayments: {
      label: 'TAMAMLA',
      tooltip: 'Tamamlamaq üçün ödənişi seçin',
    },
    cancelPayments: {
      label: 'LƏĞV ET',
      tooltip: 'Ləğv etmək üçün ödənişi seç',
    },
    selectAll: {
      label: 'HAMISI',
      tooltip: 'Bütün ödənişləri seçin',
    },
    confirm: {
      label: 'TƏSDİQLƏ',
    },
    cancel: {
      label: 'LƏĞV ET',
    },
    deleteUser: {
      label: 'HESABI SİL',
    },
  },
  breadcrumbs: {
    payments: 'Ödənişlər',
    filterOverdue: 'Gecikmiş',
    filterCurrent: 'Bu Ay',
    filterPaid: 'Ödənmiş',
    filterRemaining: 'Qalan',
    allPayments: 'Hamısı',
    details: 'Təfərrüatlar',
    addPayment: 'Əlavə Et',
    editPayment: 'Redaktə Et',
  },
  tooltips: {
    details: 'Təfərrüatlar',
    monthSelector: 'Ödənişləri görmək üçün ay və ili seçin.',
    selectAll: 'Hamısını seçin',
  },
  notifications: {
    api: {
      completePayments: {
        success: 'Ödənişlər uğurla tamamlandı.',
        error: 'Ödənişləri tamamlamaq mümkün olmadı.',
      },
      cancelPayments: {
        success: 'Ödənişlər uğurla ləğv edildi.',
        error: 'Ödənişləri ləğv etmək mümkün olmadı.',
      },
      installment: {
        add: {
          success: 'Ödəniş uğurla yaradıldı.',
          error: 'Ödənişi yaratmaq mümkün olmadı.',
        },
        edit: {
          success: 'Ödəniş uğurla yeniləndi.',
          error: 'Ödənişi yeniləmək mümkün olmadı.',
        },
        delete: {
          success: 'Ödəniş uğurla silindi.',
          error: 'Ödənişi silmək mümkün olmadı.',
        },
      },
    },
  },
  modals: {
    installment: {
      delete: {
        title: 'Ödənişi sil',
        message:
          'Bu ödənişi silmək istədiyinizə əminsiniz? Bu əməliyyatı geri qaytarmaq mümkün deyil.',
      },
    },
    auth: {
      delete: {
        title: 'Hesabı Sil',
        message:
          'Hesabınızı silmək bütün məlumatlarınızı daimi olaraq siləcək! <1/> Hesabınızı silmək üçün şifrənizi təsdiqləməlisiniz.',
      },
    },
  },
  apiErrorMessages: {
    [ERROR_MESSAGES.AUTH.USERNAME_REQUIRED]: 'İstifadəçi adı mütləqdir.',
    [ERROR_MESSAGES.AUTH.USERNAME_MIN_LENGTH]:
      'İstifadəçi adı ən azı 6 simvol olmalıdır.',
    [ERROR_MESSAGES.AUTH.USERNAME_MAX_LENGTH]:
      'İstifadəçi adı ən çoxu 20 simvol olmalıdır.',
    [ERROR_MESSAGES.AUTH.USERNAME_INVALID]:
      'İstifadəçi adı yalnız kiçik hərflər və rəqəmlərdən ibarət ola bilər.',
    [ERROR_MESSAGES.AUTH.USERNAME_EXISTS]: 'Bu istifadəçi adı artıq mövcuddur.',

    [ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED]: 'Şifrə mütləqdir.',
    [ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH]:
      'Şifrə ən azı 8 simvol olmalıdır.',
    [ERROR_MESSAGES.AUTH.PASSWORD_MAX_LENGTH]:
      'Şifrə ən çoxu 20 simvol olmalıdır.',
    [ERROR_MESSAGES.AUTH.PASSWORD_INVALID]:
      'Şifrədə ən azı bir hərf və bir rəqəm olmalıdır, boşluq ola bilməz.',
    [ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT]: 'Şifrə düzgün deyil.',

    [ERROR_MESSAGES.AUTH.TOKEN_NOT_PROVIDED]:
      'Doğrulama tokeni təmin edilməyib.',
    [ERROR_MESSAGES.AUTH.TOKEN_INVALID]: 'Doğrulama tokeni yanlışdır.',

    [ERROR_MESSAGES.AUTH.USER_NOT_FOUND]: 'İstifadəçi tapılmadı.',

    [ERROR_MESSAGES.UNKNOWN]:
      'Naməlum bir xəta baş verdi. Daha sonra yenidən cəhd edin.',
  },

  apiSuccessMessages: {
    [SUCCESS_MESSAGES.AUTH.USER_DELETED]: 'İstifadəçi uğurla silindi.',

    [SUCCESS_MESSAGES.COMMON]: 'Əməliyyat uğurla tamamlandı.',
  },
};
