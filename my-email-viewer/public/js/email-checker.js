const EMAIL_PATTERNS = {
  spam: {
    basic: {
      titlePatterns: [
        /GIẢM GIÁ.*[0-9]{2,}%/i,
        /CHỈ.*HÔM NAY/i,
        /KHUYẾN MÃI.*KHỦNG/i,
        /[💰🎉🔥⭐💯]/u,
        /!!!/,
        /\$\$\$/,
        /CLICK.*NGAY/i,
        /FREE|MIỄN PHÍ.*100%/i,
        /CƠ HỘI CUỐI/i,
      ],
      contentPatterns: [
        /giảm giá.*[789][0-9]%/i,
        /chỉ còn.*[0-9]+.*giờ/i,
        /click.*ngay.*link/i,
        /\b(bit\.ly|tinyurl|short\.link|goo\.gl)\b/,
        /!!!|💰💰💰/u,
        /nhận ngay bây giờ/i,
      ],
      fromDomainPatterns: [
        /promo|deals|sale|offer|discount|marketing|newsletter/i,
        /\d{2,}\.net|\.tk|\.ml|\.ga|\.cf|\.xyz|\.biz|\.info/,
      ],
    },
    advanced: {
      titlePatterns: [
        /ưu đãi.*đặc biệt/i,
        /thông báo.*khuyến mãi/i,
        /cơ hội.*hiếm/i,
        /chúc mừng bạn đã thắng/i,
      ],
      contentPatterns: [
        /số lượng có hạn/i,
        /đăng ký ngay để nhận/i,
        /ưu đãi dành riêng cho bạn/i,
        /đừng bỏ lỡ/i,
        /hãy hành động ngay/i,
      ],
      fromDomainPatterns: [
        /support@.*\.(info|online|site)/i,
        /noreply@.*\.(top|link)/i,
      ],
    },
  },
  phishing: {
    basic: {
      titlePatterns: [
        /bảo mật|security|alert/i,
        /tài khoản.*bị.*khóa|suspended|compromised/i,
        /xác (minh|nhận|thực).*khẩn|verify|confirm/i,
        /cập nhật.*ngay|update now/i,
        /hoạt động đáng ngờ/i,
        /thông báo thanh toán/i,
      ],
      contentPatterns: [
        /tài khoản.*sẽ bị.*khóa/i,
        /xác (minh|nhận).*trong.*[0-9]+.*giờ/i,
        /click.*link.*xác (minh|nhận)|click here to verify/i,
        /cập nhật.*thông tin.*bảo mật|security information update/i,
        /nếu bạn không (xác nhận|cập nhật).*(tài khoản|sẽ bị khóa)/i,
        /truy cập vào đường dẫn sau/i,
        /thông báo nợ|outstanding payment/i,
      ],
      fromDomainPatterns: [
        /[0-9][a-zA-Z]*\.[a-z]{2,}/,
        /-verification|-security|-account|-login|-support/i,
        /\.(tk|ml|ga|cf|gq|club|online|xyz|info)$/,
      ],
      brandSpoofing: [
        /amaz[0o]n/i,
        /g[0o]{2}gle/i,
        /micr[0o]soft/i,
        /payp[a@]l/i,
        /faceb[0o]{2}k/i,
        /apple[li1]/i,
        /microsoft[0o]/i,
        /bankofamerlca/i,
        /citi\.bank/i,
        /wellsfarg0/i,
      ],
    },
    advanced: {
      titlePatterns: [
        /thông báo từ.*phòng.*kế toán|accounting department notification/i,
        /yêu cầu xác nhận.*thanh toán|payment confirmation request/i,
        /biên lai thanh toán|invoice received/i,
      ],
      contentPatterns: [
        /vui lòng kiểm tra.*đính kèm|please review the attached/i,
        /xác nhận.*giao dịch|transaction confirmation/i,
        /để tiếp tục.*vui lòng|to continue, please/i,
        /chúng tôi đã phát hiện giao dịch bất thường/i,
        /nhấn vào đây để hủy đăng ký/i,
      ],
      fromDomainPatterns: [
        /support@.*(secure|verify|update).*\.com/i,
        /no[-_]?reply@.*(account|support|login).*\.net/i,
        /.*@(mail|secure|login|account)[0-9]{1,3}\.(com|xyz|top|tk)/i,
        /.*@(service|web|update)-(secure|info)\.(online|site)/i,
      ],
    },
  },
  suspicious: {
    basic: {
      titlePatterns: [
        /khẩn|gấp|urgent|important/i,
        /hạn chót|deadline|expiration/i,
        /quan trọng.*cập nhật|important update/i,
        /chú ý ngay lập tức|immediate attention/i,
      ],
      contentPatterns: [
        /vui lòng.*cung cấp|kindly provide/i,
        /xác nhận.*thông tin|confirm your information/i,
        /truy cập.*link.*bên dưới|access the link below/i,
        /trong vòng.*[0-9]+.*giờ|within [0-9]+ hours/i,
        /chúng tôi cần phản hồi của bạn/i,
        /để tránh sự chậm trễ/i,
      ],
      fromDomainPatterns: [
        /\.(info|click|site|online|live|world)$/i,
        /-system|-admin|-support/i,
        /\b(noreply|admin|support)\b.*@.*\.[a-z]{2,}/i,
      ],
      spellingErrors: [
        /\b(recieve|occured|loose|there account|wirte|adres|calender|definately| independant|seperate)\b/i,
      ],
    },
    advanced: {
      subtleIndicators: [
        /vui lòng phản hồi sớm|kindly respond soon/i,
        /thông tin này là bảo mật|this information is confidential/i,
        /không chia sẻ email này|do not share this email/i,
        /chỉ riêng cho bạn/i,
        /thực hiện theo các bước này/i,
      ],
    },
  },
  safe: {
    requiredPatterns: {
      fromDomainPatterns: [
        /@fpt\.edu\.vn$/i,
        /@[a-z]+\.edu\.vn$/i,
        /@(gmail|outlook|yahoo)\.com$/i,
        /@[a-z]+(corp|company|university|gov|edu)\.(com|vn|edu|org)$/i,
        /(viettel|vnpt|mobifone)\.vn$/i,
        /microsoft\.com$/i,
        /google\.com$/i,
        /apple\.com$/i,
        /github\.com$/i,
        /linkedin\.com$/i,
      ],
      professionalGreetings: [
        /^kính (gửi|chào)/i,
        /^thân gửi/i,
        /^dear/i,
        /^xin chào/i,
        /^chào bạn/i,
      ],
      professionalClosings: [
        /trân trọng/i,
        /best regards/i,
        /thân ái/i,
        /kính thư/i,
        /chân thành cảm ơn/i,
        /trân trọng cảm ơn/i,
      ],
    },
    mustNotHave: {
      suspiciousWords: [
        /click.*here|nhấp.*vào đây/i,
        /verify.*account|xác minh.*tài khoản/i,
        /suspended|bị treo/i,
        /act now|hành động ngay/i,
        /urgently|khẩn cấp/i,
        /warning|cảnh báo/i,
        /payment overdue|thanh toán quá hạn/i,
        /reset password|đặt lại mật khẩu/i,
        /unusual activity|hoạt động bất thường/i,
      ],
    },
  },
};

// Hàm kiểm tra phishing
function checkPhishing(title, content, fromEmail, containsSuspiciousLinks) {
  const phishingPatterns = EMAIL_PATTERNS["phishing"];
  const indicators = [];
  let matchCount = 0;
  let level = "basic";
  const domain = fromEmail.split("@")[1] || "";

  // Kiểm tra giả mạo thương hiệu
  phishingPatterns["basic"]["brandSpoofing"].forEach((brandPattern) => {
    if (
      brandPattern.test(fromEmail) ||
      brandPattern.test(title) ||
      brandPattern.test(content)
    ) {
      indicators.push(`Giả mạo thương hiệu`);
      matchCount += 3;
    }
  });

  // Kiểm tra domain
  phishingPatterns["basic"]["fromDomainPatterns"].forEach((phishDomain) => {
    if (phishDomain.test(domain)) {
      indicators.push(`Domain đáng ngờ liên quan đến phishing: ${domain}`);
      matchCount += 2;
    }
  });

  // 1. Kiểm tra sự không khớp giữa tên miền và nội dung

  const domainInContent = content.includes(domain);
  if (!domainInContent) {
    indicators.push("Tên miền không xuất hiện trong nội dung email");
    matchCount += 1;
  }

  // 2. Kiểm tra các liên kết ẩn
  const hiddenLinks = /<a[^>]*style=[^>]*display:\s*none[^>]*>/i.test(content);
  if (hiddenLinks) {
    indicators.push("Phát hiện liên kết ẩn trong email");
    matchCount += 3;
  }

  // 3. Kiểm tra yêu cầu thông tin cá nhân
  const personalInfoRequests =
    /(mật khẩu|số thẻ|ccv|cvv|ngày sinh|địa chỉ|password|card number|cvv)/i.test(
      content
    );
  if (personalInfoRequests) {
    indicators.push("Yêu cầu cung cấp thông tin cá nhân nhạy cảm");
    matchCount += 3;
  }

  // 4. Kiểm tra lỗi chính tả trong tên thương hiệu
  const brandTypos = /(g0ogle|micorsoft|payypal|facebok|amaz0n)/i.test(
    title + content
  );
  if (brandTypos) {
    indicators.push("Phát hiện lỗi chính tả trong tên thương hiệu");
    matchCount += 2;
  }

  // Kiểm tra tiêu đề
  phishingPatterns["basic"]["titlePatterns"].forEach((pattern) => {
    if (pattern.test(title)) {
      indicators.push(`Tiêu đề có dấu hiệu phishing`);
      matchCount++;
    }
  });

  // Kiểm tra nội dung
  phishingPatterns["basic"]["contentPatterns"].forEach((pattern) => {
    if (pattern.test(content)) {
      indicators.push(
        `Nội dung yêu cầu xác minh khẩn cấp/thông tin cá nhân: ${pattern}`
      );
      matchCount++;
    }
  });

  if (containsSuspiciousLinks) {
    indicators.push("Người dùng báo cáo có liên kết đáng ngờ (chỉ báo mạnh)");
    matchCount += 4;
  }

  // Kiểm tra nâng cao
  phishingPatterns["advanced"]["titlePatterns"].forEach((pattern) => {
    if (pattern.test(title)) {
      indicators.push(`Tiêu đề có dấu hiệu phishing nâng cao: ${pattern}`);
      matchCount++;
    }
  });

  phishingPatterns["advanced"]["contentPatterns"].forEach((pattern) => {
    if (pattern.test(content)) {
      indicators.push(`Nội dung có dấu hiệu phishing nâng cao: ${pattern}`);
      matchCount++;
    }
  });

  phishingPatterns["advanced"]["fromDomainPatterns"].forEach((pattern) => {
    if (pattern.test(fromEmail)) {
      indicators.push(
        `Domain email đáng ngờ trong cấu trúc nâng cao: ${fromEmail}`
      );
      matchCount++;
    }
  });

  // Xác định mức độ
  if (matchCount >= 6) {
    level = "high";
  } else if (matchCount >= 3) {
    level = "medium";
  } else {
    level = "low";
  }

  const confidence = Math.min(
    matchCount * 0.15 + (containsSuspiciousLinks ? 0.25 : 0),
    1.0
  );
  return {
    isPhishing: matchCount >= 2 || containsSuspiciousLinks,
    confidence: confidence,
    indicators: [...new Set(indicators)],
    level: level,
  };
}

//checkSafe
function checkSafe(title, content, fromEmail) {
  const safePatterns = EMAIL_PATTERNS["safe"];
  const indicators = [];
  let safeScore = 0;

  // Domain an toàn: +3 điểm
  const domainSafe = safePatterns.requiredPatterns.fromDomainPatterns.some(
    (pattern) => pattern.test(fromEmail)
  );
  if (domainSafe) {
    indicators.push("Domain email thuộc danh sách an toàn");
    safeScore += 3;
  }

  // Lời chào chuyên nghiệp: +1 điểm
  const hasProfessionalGreeting =
    safePatterns.requiredPatterns.professionalGreetings.some((pattern) =>
      pattern.test(content)
    );
  if (hasProfessionalGreeting) {
    indicators.push("Email có lời chào chuyên nghiệp");
    safeScore += 1;
  }

  // Kết thúc chuyên nghiệp: +1 điểm
  const hasProfessionalClosing =
    safePatterns.requiredPatterns.professionalClosings.some((pattern) =>
      pattern.test(content)
    );
  if (hasProfessionalClosing) {
    indicators.push("Email có lời kết chuyên nghiệp");
    safeScore += 1;
  }

  // Trừ điểm nếu có từ ngữ đáng ngờ
  const hasSuspiciousWord = safePatterns.mustNotHave.suspiciousWords.some(
    (pattern) => pattern.test(content) || pattern.test(title)
  );
  if (hasSuspiciousWord) {
    indicators.push("Có chứa từ khóa đáng ngờ");
    safeScore -= 2;
  }

  const confidence = Math.min(safeScore / 5, 1.0); // Tối đa 5 điểm

  return {
    isSafe: safeScore >= 2,
    confidence: confidence,
    indicators: [...new Set(indicators)],
    level: confidence > 0.6 ? "high" : "low",
  };
}

//checkSpam
function checkSpam(title, content, fromEmail) {
  const spamPatterns = EMAIL_PATTERNS["spam"];
  const indicators = [];
  let matchCount = 0;
  let level = "basic";
  const domain = fromEmail.split("@")[1] || "";

  // Basic title patterns
  spamPatterns["basic"]["titlePatterns"].forEach((pattern) => {
    if (pattern.test(title)) {
      indicators.push(`Tiêu đề có dấu hiệu spam`);
      matchCount++;
    }
  });

  const spamKeywords = [
    "giảm giá",
    "khuyến mãi",
    "miễn phí",
    "sale",
    "deal",
    "offer",
    "discount",
  ];
  let keywordCount = 0;

  spamKeywords.forEach((keyword) => {
    const regex = new RegExp(keyword, "gi");
    const titleMatches = (title.match(regex) || []).length;
    const contentMatches = (content.match(regex) || []).length;
    keywordCount += titleMatches + contentMatches;
  });

  if (keywordCount > 3) {
    indicators.push(`Phát hiện ${keywordCount} từ khóa spam`);
    matchCount += Math.min(keywordCount, 5); // Tối đa +5 điểm
  }

  // Kiểm tra sử dụng nhiều dấu chấm than
  const exclamationCount =
    (title.match(/!/g) || []).length + (content.match(/!/g) || []).length;
  if (exclamationCount > 2) {
    indicators.push(`Sử dụng quá nhiều dấu chấm than (${exclamationCount})`);
    matchCount += Math.min(exclamationCount, 3); // Tối đa +3 điểm
  }

  // Basic domain patterns
  spamPatterns["basic"]["fromDomainPatterns"].forEach((pattern) => {
    if (pattern.test(domain)) {
      indicators.push(`Domain đáng ngờ spam: ${domain}`);
      matchCount += 2;
    }
  });

  // Advanced patterns
  spamPatterns["advanced"]["titlePatterns"].forEach((pattern) => {
    if (pattern.test(title)) {
      indicators.push(`Tiêu đề spam nâng cao: ${pattern}`);
      matchCount++;
    }
  });

  spamPatterns["advanced"]["contentPatterns"].forEach((pattern) => {
    if (pattern.test(content)) {
      indicators.push(`Nội dung spam nâng cao: ${pattern}`);
      matchCount++;
    }
  });

  spamPatterns["advanced"]["fromDomainPatterns"].forEach((pattern) => {
    if (pattern.test(fromEmail)) {
      indicators.push(`Domain spam nâng cao: ${fromEmail}`);
      matchCount++;
    }
  });

  if (matchCount >= 5) level = "high";
  else if (matchCount >= 3) level = "medium";

  const confidence = Math.min(matchCount * 0.12, 1.0);

  return {
    isSpam: matchCount >= 2,
    confidence: confidence,
    indicators: [...new Set(indicators)],
    level: level,
  };
}

//5. Thêm hàm checkSuspicious
function checkSuspicious(title, content, fromEmail) {
  const patterns = EMAIL_PATTERNS["suspicious"];
  const indicators = [];
  let matchCount = 0;

  // Kiểm tra các mẫu cơ bản
  patterns.basic.titlePatterns.forEach((pattern) => {
    if (pattern.test(title)) {
      indicators.push(`Tiêu đề có dấu hiệu đáng ngờ: ${pattern}`);
      matchCount++;
    }
  });

  patterns.basic.contentPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      indicators.push(`Nội dung có dấu hiệu đáng ngờ: ${pattern}`);
      matchCount++;
    }
  });

  // Kiểm tra lỗi chính tả
  patterns.basic.spellingErrors.forEach((pattern) => {
    if (pattern.test(title + content)) {
      indicators.push(`Phát hiện lỗi chính tả: ${pattern}`);
      matchCount++;
    }
  });

  // Kiểm tra các chỉ báo tinh vi
  patterns.advanced.subtleIndicators.forEach((pattern) => {
    if (pattern.test(content)) {
      indicators.push(`Chỉ báo đáng ngờ: ${pattern}`);
      matchCount += 2;
    }
  });

  const confidence = Math.min(matchCount * 0.15, 1.0);

  return {
    isSuspicious: matchCount > 0,
    confidence: confidence,
    indicators: [...new Set(indicators)],
    level: confidence > 0.4 ? "medium" : "low",
  };
}

// (Để ngắn gọn, tôi sẽ không hiển thị toàn bộ ở đây nhưng bạn có thể triển khai tương tự)

// Hàm phân loại email chính
function classifyEmail(emailData) {
  const {
    subject,
    content,
    fromEmail,
    hasAttachment,
    containsSuspiciousLinks,
  } = emailData;

  // Kiểm tra tất cả các loại
  const results = {
    phishing: checkPhishing(
      subject,
      content,
      fromEmail,
      containsSuspiciousLinks
    ),
    spam: checkSpam(subject, content, fromEmail),
    safe: checkSafe(subject, content, fromEmail),
    suspicious: checkSuspicious(subject, content, fromEmail),
  };

  // Tìm kết quả có độ tin cậy cao nhất
  let maxConfidence = 0;
  let finalResult = results.suspicious;

  for (const [category, result] of Object.entries(results)) {
    if (result.confidence > maxConfidence) {
      maxConfidence = result.confidence;
      finalResult = result;
    }
  }

  // Xử lý đặc biệt cho phishing có độ tin cậy cao
  if (results.phishing.confidence > 0.7) {
    return results.phishing;
  }

  return finalResult;
}

// Hiển thị kết quả kiểm tra
function displayResult(result) {
  const resultContainer = document.getElementById("email-result");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultIndicators = document.getElementById("result-indicators");

  // Thiết lập class và nội dung dựa trên kết quả
  let resultClass = "";
  let titleText = "";

  switch (result.category) {
    case "phishing":
      resultClass = "bg-red-50 border-l-4 border-red-500 text-red-700";
      titleText = "⚠️ Email có dấu hiệu lừa đảo (Phishing)";
      break;
    case "spam":
      resultClass = "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700";
      titleText = "📧 Email có dấu hiệu Spam";
      break;
    case "suspicious":
      resultClass = "bg-orange-50 border-l-4 border-orange-500 text-orange-700";
      titleText = "🔍 Email đáng ngờ";
      break;
    case "safe":
      resultClass = "bg-green-50 border-l-4 border-green-500 text-green-700";
      titleText = "✅ Email an toàn";
      break;
    default:
      resultClass = "bg-gray-50 border-l-4 border-gray-500 text-gray-700";
      titleText = "❓ Không xác định";
  }

  // Cập nhật giao diện
  document.getElementById(
    "result-content"
  ).className = `p-4 rounded-md ${resultClass}`;
  resultTitle.textContent = titleText;
  resultMessage.textContent = `Độ tin cậy: ${Math.round(
    result.confidence * 100
  )}% (Mức độ: ${result.level})`;

  resultIndicators.innerHTML = "";
  result.indicators.forEach((indicator) => {
    const li = document.createElement("li");
    li.textContent = indicator;
    resultIndicators.appendChild(li);
  });

  resultContainer.classList.remove("hidden");
}

// show thong bao
function showMessage(message, duration = 2000) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, duration);
}

// ==== Setup sự kiện ====
function setupEmailChecker() {
  const checkBtn = document.getElementById("check-email-btn");
  const fromInput = document.getElementById("from-email");
  const subjectInput = document.getElementById("email-subject");
  const contentInput = document.getElementById("email-content");
  const attachInput = document.getElementById("has-attachment");
  const suspiciousLinksInput = document.getElementById("suspicious-links");

  // Kiểm tra nếu các phần tử không tồn tại -> báo lỗi console
  if (!checkBtn || !fromInput || !subjectInput || !contentInput) {
    console.error("❌ Một số phần tử HTML bị thiếu ID cần thiết!");
    return;
  }

  checkBtn.addEventListener("click", () => {
    const fromEmail = fromInput.value.trim();
    const subject = subjectInput.value.trim();
    const content = contentInput.value.trim();
    const hasAttachment = attachInput ? attachInput.checked : false;
    const suspiciousLinks = suspiciousLinksInput
      ? suspiciousLinksInput.checked
      : false;

    if (!fromEmail || !subject || !content) {
      showMessage("Vui lòng điền đầy đủ thông tin email");
      return;
    }

    const result = classifyEmail({
      subject,
      content,
      fromEmail,
      hasAttachment,
      containsSuspiciousLinks: suspiciousLinks,
    });

    displayResult(result);
  });
}

// ==== Khởi chạy khi DOM sẵn sàng ====
document.addEventListener("DOMContentLoaded", setupEmailChecker);
