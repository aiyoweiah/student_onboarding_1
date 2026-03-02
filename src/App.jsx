// VERSION: 1.0.0
// DODO Learning — Student Enrollment Welcome Packet PDF Generator
// Generates multi-page PDF via jsPDF + html2canvas
//
// DEPENDENCIES: npm install jspdf html2canvas

import { useState, useCallback, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LOGO_B64 } from "./assets/logo";

// ─── BRAND ──────────────────────────────────────────────────────────────
const B = {
  cream: "#f5e8d7", green: "#6b8e75", greenDark: "#4f6b58", greenLight: "#e8f0eb",
  brown: "#7a5145", brownDark: "#5c3c33", brownLight: "#f0e3dc",
  ink: "#2a1f1a", muted: "#8a7a72", border: "#e2d5c8", white: "#fffdf9",
};

// ═══════════════════════════════════════════════════════════════════════
// PDF TEMPLATE COMPONENTS (hidden off-screen, captured by html2canvas)
// ═══════════════════════════════════════════════════════════════════════

const F = '"Noto Sans SC", "Avenir Next", "Avenir", "Helvetica Neue", sans-serif';
const PW = 794;
const PH = 1123;
const PAD = 30;

function PDFHeader() {
  return (
    <div style={{ background: B.cream, padding: `18px ${PAD}px 12px`, borderBottom: `3px solid ${B.green}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={LOGO_B64} alt="DODO" style={{ height: 40, width: "auto" }} />
        <div style={{ borderLeft: `1.5px solid rgba(122,81,69,0.25)`, paddingLeft: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", opacity: 0.65, fontFamily: F, fontWeight: 500 }}>DODO Learning · 都学学习</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: F, marginTop: 1 }}>
            Student Enrollment Packet
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.72, marginLeft: 8 }}>学生入学资料</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE 1: WELCOME LETTER
// ═══════════════════════════════════════════════════════════════════════

function PDFPageWelcome({ info, signatureImg }) {
  return (
    <div id="pdf-welcome" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader />
      <div style={{ padding: `24px ${PAD + 10}px ${PAD}px`, display: "flex", flexDirection: "column" }}>
        {/* Decorative top */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: B.muted }}>Welcome Letter · 欢迎信</div>
          <div style={{ width: 60, height: 2, background: B.green, margin: "8px auto 0" }} />
        </div>

        {/* Greeting */}
        <div style={{ fontSize: 15, fontWeight: 600, color: B.brown, marginBottom: 16, fontFamily: F }}>
          Dear {info.name || "Student"},
        </div>

        {/* English body */}
        <div style={{ fontSize: 11.5, lineHeight: 1.85, color: B.ink, marginBottom: 20, textAlign: "justify" }}>
          <p style={{ margin: "0 0 12px" }}>
            Welcome to DODO Learning! We are absolutely thrilled to have you join our family, where learning is an adventure, and goals are reached. Our dedicated teachers and staff are here to guide you every step of the way, creating a nurturing and dynamic learning environment tailored to help you succeed. Whether this is your first step with us or you're continuing your journey, know that you are in a place where you are valued, supported, and encouraged to shine.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            As you embark on this exciting chapter, we encourage you to embrace every opportunity, ask questions, make new friends, and, most importantly, believe in yourself. You have a unique voice, and we can't wait to see how you will contribute to and enrich our community.
          </p>
          <p style={{ margin: 0 }}>
            Once again, welcome to DODO Learning! We can't wait to see all the incredible things you will accomplish.
          </p>
        </div>

        {/* Warmest regards */}
        <div style={{ fontSize: 12, fontWeight: 600, color: B.brown, marginBottom: 18, fontStyle: "italic" }}>
          Warmest regards,
        </div>

        {/* Divider */}
        <div style={{ width: "100%", height: 1, background: B.border, marginBottom: 18 }} />

        {/* Chinese body */}
        <div style={{ fontSize: 11, lineHeight: 1.9, color: B.ink, marginBottom: 20, textAlign: "justify" }}>
          <p style={{ margin: "0 0 10px" }}>
            欢迎来到 DODO Learning!很高兴你能加入我们,让学习成为一场奔向目标的冒险。我们的专业教师团队将为你提供温暖且充满动力的学习环境,全方位助力你的成功。在这里,你是被珍视的个体;在这里,我们全力支持你尽情闪耀。
          </p>
          <p style={{ margin: "0 0 10px" }}>
            站在这个新起点上,请尽情拥抱每一个机会,保持好奇,并坚定地相信自己。我们非常期待看到你独一无二的才华将如何点亮我们的社区。
          </p>
          <p style={{ margin: 0 }}>
            欢迎开启这段精彩旅程,期待见证你的每一份卓越成就!
          </p>
        </div>

        {/* Signature */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {signatureImg ? (
            <img src={signatureImg} alt="Signature" style={{ height: 60, width: "auto", marginBottom: 4, objectFit: "contain" }} />
          ) : (
            <div style={{ height: 50, marginBottom: 4 }} />
          )}
          <div style={{ fontSize: 12, fontWeight: 700, color: B.brown }}>Janet</div>
          <div style={{ fontSize: 10, color: B.muted }}>DODO Learning</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE 2: STUDENT INFO + CLASS INFO (QR CODES) + HOW TO ACTIVATE
// ═══════════════════════════════════════════════════════════════════════

function PDFPageInfo({ info, qrImages }) {
  return (
    <div id="pdf-info" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader />
      <div style={{ padding: `14px ${PAD}px ${PAD}px`, display: "flex", flexDirection: "column" }}>

        {/* Student Information */}
        <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 18px", marginBottom: 14, border: `1px solid ${B.border}` }}>
          <div style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Student Information </span>
            <span style={{ fontSize: 11, color: B.muted }}>学生信息</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, rowGap: 14 }}>
            {[
              ["Name 学生姓名", info.name],
              ["Age 年龄", info.age],
              ["Grade 年级", info.grade],
              ["Location 所在地", info.location],
              ["Signature Programs 定制课程组合", info.programs],
              ["Date 日期", info.date],
            ].map(([lbl, val]) => (
              <div key={lbl}>
                <div style={{ fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: B.ink, minHeight: 18, borderBottom: `1.5px solid ${B.border}`, paddingBottom: 3 }}>{val || "—"}</div>
              </div>
            ))}
          </div>
          {/* Course Levels Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4 }}>Literacy & Fluency Course Level 精读表达课程级别</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.ink, minHeight: 18, borderBottom: `1.5px solid ${B.border}`, paddingBottom: 3 }}>{info.literacyLevel || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, letterSpacing: 1.5, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4 }}>Master Writing & Composition Level 大师写作课程级别</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.ink, minHeight: 18, borderBottom: `1.5px solid ${B.border}`, paddingBottom: 3 }}>{info.writingLevel || "—"}</div>
            </div>
          </div>
        </div>

        {/* Class Information — QR Codes */}
        <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", marginBottom: 14, border: `1px solid ${B.border}` }}>
          <div style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Class Information </span>
            <span style={{ fontSize: 11, color: B.muted }}>班级信息</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { key: "qr1", title: "精读口语课班级", titleEn: "Literacy and Fluency" },
              { key: "qr2", title: "写作专项课程班级", titleEn: "Writing and Composition" },
              { key: "qr3", title: "The Hangar 在线研习室班级", titleEn: "" },
            ].map(qr => (
              <div key={qr.key} style={{ textAlign: "center", padding: 8, background: B.greenLight, borderRadius: 8, border: `1px solid ${B.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: B.green, marginBottom: 2 }}>{qr.title}</div>
                {qr.titleEn && <div style={{ fontSize: 9, color: B.muted, marginBottom: 6 }}>{qr.titleEn}</div>}
                {!qr.titleEn && <div style={{ marginBottom: 6 }} />}
                <div style={{ width: 120, height: 120, margin: "0 auto", background: B.white, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${B.border}` }}>
                  {qrImages[qr.key] ? (
                    <img src={qrImages[qr.key]} alt={qr.title} style={{ width: 110, height: 110, objectFit: "contain" }} />
                  ) : (
                    <div style={{ fontSize: 9, color: B.border }}>QR Code</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Activate */}
        <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
          <div style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>How to Activate Your Lesson </span>
            <span style={{ fontSize: 11, color: B.muted }}>如何加入班级</span>
          </div>
          <div style={{ fontSize: 10.5, lineHeight: 1.75, color: B.ink }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: B.green }}>•</span> 有ClassIn 账号学生，请直接扫码进入班级并完成测评。
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: B.green }}>•</span> 没有ClassIn账号，请按照以下步骤安装下载并注册，然后扫码加入班级：
            </div>
            <div style={{ paddingLeft: 16 }}>
              <div style={{ marginBottom: 4, display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, color: B.brown, flexShrink: 0 }}>1)</span>
                <span>电脑或者iPad下载。苹果 APP：ClassIn，或官网：<span style={{ color: B.green, fontWeight: 600 }}>https://www.classin.com</span></span>
              </div>
              <div style={{ marginBottom: 4, display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, color: B.brown, flexShrink: 0 }}>2)</span>
                <span>创建自己的账号。<span style={{ fontWeight: 700, color: B.brown }}>注意：请把名字设为学生报名的名字。</span></span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontWeight: 700, color: B.brown, flexShrink: 0 }}>3)</span>
                <span>扫码进入班级</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE 3: SCHEDULE + COURSE OVERVIEWS + TEACHER INFO + PARENT NOTES
// ═══════════════════════════════════════════════════════════════════════

function PDFPageDetails({ info, schedule, literacyAbout, literacyOverview, writingOverview, teacherImg, teacherIntro, parentNotes }) {
  // Determine which optional sections are filled
  const hasLiteracyAbout = literacyAbout && literacyAbout.trim();
  const hasLiteracyOverview = literacyOverview && literacyOverview.trim();
  const hasWritingOverview = writingOverview && writingOverview.trim();
  const hasTeacher = (teacherImg || (teacherIntro && teacherIntro.trim()));
  const hasParentNotes = parentNotes && parentNotes.trim();

  return (
    <div id="pdf-details" style={{ width: PW, minHeight: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box" }}>
      <PDFHeader />
      <div style={{ padding: `14px ${PAD}px ${PAD}px`, display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Lesson Schedule */}
        <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
          <div style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Lesson Schedule </span>
            <span style={{ fontSize: 11, color: B.muted }}>上课时间</span>
          </div>
          <div style={{ fontSize: 10.5, lineHeight: 1.8, color: B.ink }}>
            <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 4, rowGap: 6 }}>
              <div style={{ fontWeight: 700, color: B.brown }}>课程组合：</div>
              <div>{schedule.combo || "—"}</div>
              <div style={{ fontWeight: 700, color: B.brown }}>精读表达课：</div>
              <div>{schedule.literacy || "—"}</div>
              <div style={{ fontWeight: 700, color: B.brown }}>写作专项课程：</div>
              <div>{schedule.writing || "—"}</div>
              <div style={{ fontWeight: 700, color: B.brown }}>The Hangar 在线研习室：</div>
              <div>{schedule.hangar || "周一到周四任何一天权限。"}</div>
            </div>
          </div>
        </div>

        {/* About Literacy & Fluency (hide if blank) */}
        {hasLiteracyAbout && (
          <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>About Literacy & Fluency Course </span>
              <span style={{ fontSize: 11, color: B.muted }}>关于精读表达课</span>
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.75, color: B.ink, whiteSpace: "pre-wrap" }}>{literacyAbout}</div>
          </div>
        )}

        {/* Literacy & Fluency Course Overview (hide if blank) */}
        {hasLiteracyOverview && (
          <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Literacy & Fluency Course Overview </span>
              <span style={{ fontSize: 11, color: B.muted }}>精读表达课课程大纲</span>
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.75, color: B.ink, whiteSpace: "pre-wrap" }}>{literacyOverview}</div>
          </div>
        )}

        {/* Writing & Composition Course Overview (hide if blank) */}
        {hasWritingOverview && (
          <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Writing & Composition Course Overview </span>
              <span style={{ fontSize: 11, color: B.muted }}>大师写作专项课程大纲</span>
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.75, color: B.ink, whiteSpace: "pre-wrap" }}>{writingOverview}</div>
          </div>
        )}

        {/* Teacher Info */}
        {hasTeacher && (
          <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Teacher Profile </span>
              <span style={{ fontSize: 11, color: B.muted }}>老师信息&介绍</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 100, height: 120, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.border}`, flexShrink: 0, background: B.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {teacherImg ? (
                  <img src={teacherImg} alt="Teacher" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: 9, color: B.border }}>Photo</div>
                )}
              </div>
              <div style={{ flex: 1, fontSize: 10, lineHeight: 1.75, color: B.ink, whiteSpace: "pre-wrap" }}>
                {teacherIntro || ""}
              </div>
            </div>
          </div>
        )}

        {/* Parent Notes */}
        {hasParentNotes && (
          <div style={{ background: B.white, borderRadius: 8, padding: "14px 16px 16px", border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>致家长和亲爱的你</span>
            </div>
            <div style={{ fontSize: 10, lineHeight: 1.75, color: B.ink, whiteSpace: "pre-wrap" }}>{parentNotes}</div>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// TERMS OF SERVICE PAGE (FIXED CONTENT)
// ═══════════════════════════════════════════════════════════════════════

function PDFPageTerms() {
  return (
    <div id="pdf-terms" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader />
      <div style={{ padding: `14px ${PAD}px ${PAD}px` }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: B.brown }}>Terms of Service</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>课程心愿契约</div>
          <div style={{ width: 60, height: 2, background: B.green, margin: "8px auto 0" }} />
        </div>

        {/* Our Commitment */}
        <div style={{ background: B.white, borderRadius: 8, padding: "12px 14px 14px", marginBottom: 10, border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.green, marginBottom: 6, letterSpacing: 1 }}>我们的承诺</div>
          <div style={{ fontSize: 9, color: B.muted, marginBottom: 8, fontStyle: "italic" }}>我们将全力以赴，为您开启成长之门。</div>
          <div style={{ fontSize: 9.5, lineHeight: 1.75, color: B.ink }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: B.brown }}>• 教学保障：</span>准时提供高标准的教师，课程及学术支持。若老师因病或特殊情况缺勤，我们负责安排补课。
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: B.brown }}>• "试听课"说明：</span>
            </div>
            <div style={{ paddingLeft: 14, marginBottom: 6 }}>
              <div style={{ marginBottom: 3 }}>为了确保老师和学生之间能够达成最佳的教学共鸣，我们的"试听课"政策如下：</div>
              <div style={{ marginBottom: 3 }}>
                <span style={{ fontWeight: 700, color: B.greenDark }}>首课磨合期 (First Session Fit)：</span>第一节课结束后，若您认为当前 Program 的节奏或方向与孩子的需求不匹配，我们将提供全额退款。我们尊重您的选择，也坚持寻找最适合的培养对象。
              </div>
              <div style={{ marginBottom: 3 }}>
                <span style={{ fontWeight: 700, color: B.greenDark }}>首周试行期 (Onboarding Week)：</span>若在第一节课之后、第一周结束前决定退出，首周费用将不予退还，Program 将自动终止。
              </div>
              <div style={{ marginBottom: 3 }}>
                <span style={{ fontWeight: 700, color: B.greenDark }}>稳定培养期 (Post-Week 1)：</span>进入第二周后，Program 费用将不再支持退还。Language Mastery 是一个长期的过程，我们期待与家长共同维持一个稳定、高效的训练环境。
              </div>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: B.brown }}>• 成长记录：</span>提供课堂录像供您复习（我们也可能在模糊面部后将其作为精彩瞬间展示）。我们会严格保护您的个人信息，除法律要求外绝不外泄。
            </div>
          </div>
        </div>

        {/* Student's Code */}
        <div style={{ background: B.white, borderRadius: 8, padding: "12px 14px 14px", border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B.green, marginBottom: 6, letterSpacing: 1 }}>你的成长守则</div>
          <div style={{ fontSize: 9, color: B.muted, marginBottom: 8, fontStyle: "italic" }}>进步，源于每一天的坚持与尊重。</div>
          <div style={{ fontSize: 9.5, lineHeight: 1.75, color: B.ink }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: B.brown }}>• 课堂礼仪与约定：</span>缺席请提前 48 小时通知（一对一课程无法补课 & 小组课请看回放）。课中保持礼貌与尊重，共同维护舒适的课堂环境，违规干扰者将无法继续上课且不予退费。
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: B.brown }}>• 软硬兼备：</span>请自备稳定的网络和设备，确保学习不掉线。
            </div>
            <div>
              <span style={{ fontWeight: 700, color: B.brown }}>• 尊重原创：</span>课程资料仅供个人学习，禁止私自复制、转发或分享。
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ width: 40, height: 2, background: B.green, margin: "0 auto 10px" }} />
          <div style={{ fontSize: 9, color: B.muted }}>DODO Learning · 都学学习</div>
          <div style={{ fontSize: 8, color: B.border, marginTop: 3 }}>This document is confidential and intended for the enrolled student and their family.</div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — INPUT FORM + PDF GENERATION
// ═══════════════════════════════════════════════════════════════════════

export default function DodoEnrollmentPDF() {
  // Student Info
  const [info, setInfo] = useState({
    name: "", age: "", grade: "", location: "", programs: "",
    literacyLevel: "", writingLevel: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Schedule
  const [schedule, setSchedule] = useState({ combo: "", literacy: "", writing: "", hangar: "周一到周四任何一天权限。" });

  // Course content (hide-if-blank)
  const [literacyAbout, setLiteracyAbout] = useState("");
  const [literacyOverview, setLiteracyOverview] = useState("");
  const [writingOverview, setWritingOverview] = useState("");

  // Teacher
  const [teacherImg, setTeacherImg] = useState(null);
  const [teacherIntro, setTeacherIntro] = useState("");

  // Parent notes
  const [parentNotes, setParentNotes] = useState("");

  // QR code images
  const [qrImages, setQrImages] = useState({ qr1: null, qr2: null, qr3: null });

  // Signature image
  const [signatureImg, setSignatureImg] = useState(null);

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  // Image upload helper
  const handleImageUpload = (key, setter) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof setter === "function" && typeof key === "string" && key.startsWith("qr")) {
        setQrImages(prev => ({ ...prev, [key]: ev.target.result }));
      } else {
        setter(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // ─── PDF GENERATION ─────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    setStatus("Rendering packet…");
    try {
      setStatus("Waiting for fonts…");
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 150));

      const capture = async (id) => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`#${id} not found`);
        return html2canvas(el, { scale: 2, useCORS: true, backgroundColor: B.cream, logging: false });
      };

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210, pageH = 297;

      // Determine which pages to render
      const pageIds = ["pdf-welcome", "pdf-info"];

      // Details page - always include (schedule is always present)
      pageIds.push("pdf-details");

      // Terms page - always last
      pageIds.push("pdf-terms");

      for (let i = 0; i < pageIds.length; i++) {
        setStatus(`Capturing page ${i + 1} of ${pageIds.length}…`);
        const canvas = await capture(pageIds[i]);
        if (i > 0) pdf.addPage();
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;
        // If content is taller than one page, tile it
        if (imgH > pageH) {
          const totalCanvasH = canvas.height;
          const sliceH = (pageH / imgW) * canvas.width;
          let y = 0;
          let pageNum = 0;
          while (y < totalCanvasH) {
            if (pageNum > 0) pdf.addPage();
            // Create a slice canvas
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            const thisSliceH = Math.min(sliceH, totalCanvasH - y);
            sliceCanvas.height = thisSliceH;
            const ctx = sliceCanvas.getContext("2d");
            ctx.drawImage(canvas, 0, y, canvas.width, thisSliceH, 0, 0, canvas.width, thisSliceH);
            const sliceImgH = (thisSliceH * imgW) / canvas.width;
            pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, imgW, sliceImgH);
            y += sliceH;
            pageNum++;
          }
        } else {
          pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, imgW, Math.min(imgH, pageH));
        }
      }

      const fileName = `DodoEnrollment_${(info.name || "Student").replace(/\s+/g, "_")}_${info.date}.pdf`;
      pdf.save(fileName);
      setStatus(`✓ Saved: ${fileName}`);
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // ─── FORM STYLES ────────────────────────────────────────────────────
  const inp = { width: "100%", padding: "8px 10px", border: `1.5px solid ${B.border}`, borderRadius: 6, fontSize: 14, fontFamily: "inherit", background: B.white, color: B.ink, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4, display: "block" };
  const sectionTitle = { fontSize: 12, fontWeight: 700, color: B.brown, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 };
  const card = { background: B.white, borderRadius: 10, padding: 18, marginBottom: 16, border: `1px solid ${B.border}` };

  return (
    <div style={{ fontFamily: '"Noto Sans SC", "Avenir Next", sans-serif', minHeight: "100vh", background: "#f0ece8" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Form Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${B.green}` }}>
          <img src={LOGO_B64} alt="DODO" style={{ height: 40 }} />
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: B.muted }}>DODO Learning</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: B.brown }}>Enrollment Packet Generator</div>
          </div>
        </div>

        {/* ═══ STUDENT INFO ═══ */}
        <div style={card}>
          <div style={sectionTitle}>Student Information 学生信息</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              ["name", "Student Name 学生姓名", "text"],
              ["age", "Age 年龄", "text"],
              ["grade", "Grade 年级", "text"],
              ["location", "Location (City, Country) 所在地", "text"],
              ["programs", "Signature Programs 定制课程组合", "text"],
              ["date", "Date 日期", "date"],
            ].map(([k, label, type]) => (
              <label key={k} style={{ display: "flex", flexDirection: "column" }}>
                <span style={lbl}>{label}</span>
                <input type={type} value={info[k]} onChange={e => setInfo(i => ({ ...i, [k]: e.target.value }))} style={inp} />
              </label>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>Literacy & Fluency Course Level 精读表达课程级别</span>
              <input type="text" value={info.literacyLevel} onChange={e => setInfo(i => ({ ...i, literacyLevel: e.target.value }))} style={inp} />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>Master Writing & Composition Level 大师写作课程级别</span>
              <input type="text" value={info.writingLevel} onChange={e => setInfo(i => ({ ...i, writingLevel: e.target.value }))} style={inp} />
            </label>
          </div>
        </div>

        {/* ═══ QR CODES ═══ */}
        <div style={card}>
          <div style={sectionTitle}>Class Information 班级信息 — QR Codes</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { key: "qr1", label: "精读口语课班级 / Literacy and Fluency" },
              { key: "qr2", label: "写作专项课程班级 / Writing and Composition" },
              { key: "qr3", label: "The Hangar 在线研习室班级" },
            ].map(qr => (
              <div key={qr.key} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: B.ink }}>{qr.label}</div>
                <div style={{ width: 140, height: 140, margin: "0 auto 8px", background: B.cream, borderRadius: 8, border: `2px dashed ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {qrImages[qr.key] ? (
                    <img src={qrImages[qr.key]} alt={qr.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <span style={{ fontSize: 11, color: B.muted }}>Upload QR</span>
                  )}
                </div>
                <label style={{ cursor: "pointer", fontSize: 11, color: B.green, fontWeight: 600 }}>
                  📷 Upload
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload(qr.key, null)} />
                </label>
                {qrImages[qr.key] && (
                  <button onClick={() => setQrImages(prev => ({ ...prev, [qr.key]: null }))} style={{ display: "block", margin: "4px auto 0", fontSize: 10, color: "#c0504d", background: "none", border: "none", cursor: "pointer" }}>✕ Remove</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SCHEDULE ═══ */}
        <div style={card}>
          <div style={sectionTitle}>Lesson Schedule 上课时间</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>课程组合</span>
              <input type="text" value={schedule.combo} onChange={e => setSchedule(s => ({ ...s, combo: e.target.value }))} style={inp} placeholder="e.g. CORE稳健航行" />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>精读表达课 Day & Time</span>
              <input type="text" value={schedule.literacy} onChange={e => setSchedule(s => ({ ...s, literacy: e.target.value }))} style={inp} placeholder="e.g. 周二&周四 晚 7:00-7:30" />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>写作专项课程 Day & Time</span>
              <input type="text" value={schedule.writing} onChange={e => setSchedule(s => ({ ...s, writing: e.target.value }))} style={inp} placeholder="e.g. 周三晚 7:30-8:20" />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>The Hangar 在线研习室</span>
              <input type="text" value={schedule.hangar} onChange={e => setSchedule(s => ({ ...s, hangar: e.target.value }))} style={inp} />
            </label>
          </div>
        </div>

        {/* ═══ COURSE CONTENT (OPTIONAL) ═══ */}
        <div style={card}>
          <div style={sectionTitle}>Course Content 课程内容 <span style={{ fontSize: 10, fontWeight: 400, color: B.muted, textTransform: "none", letterSpacing: 0 }}>(leave blank to hide on PDF)</span></div>

          <label style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
            <span style={lbl}>About Literacy & Fluency Course 关于精读表达课</span>
            <textarea value={literacyAbout} onChange={e => setLiteracyAbout(e.target.value)} rows={4} placeholder="Leave blank to hide this section on PDF…" style={{ ...inp, resize: "vertical", lineHeight: 1.6, fontSize: 13, background: B.cream }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
            <span style={lbl}>Literacy & Fluency Course Overview 精读表达课课程大纲</span>
            <textarea value={literacyOverview} onChange={e => setLiteracyOverview(e.target.value)} rows={4} placeholder="Use bullet points (•) or tables. Leave blank to hide…" style={{ ...inp, resize: "vertical", lineHeight: 1.6, fontSize: 13, background: B.cream }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            <span style={lbl}>Writing & Composition Course Overview 大师写作专项课程大纲</span>
            <textarea value={writingOverview} onChange={e => setWritingOverview(e.target.value)} rows={4} placeholder="Use bullet points (•) or tables. Leave blank to hide…" style={{ ...inp, resize: "vertical", lineHeight: 1.6, fontSize: 13, background: B.cream }} />
          </label>
        </div>

        {/* ═══ TEACHER INFO ═══ */}
        <div style={card}>
          <div style={sectionTitle}>Teacher Profile 老师信息&介绍</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 120, height: 140, background: B.cream, borderRadius: 8, border: `2px dashed ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 6 }}>
                {teacherImg ? (
                  <img src={teacherImg} alt="Teacher" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 11, color: B.muted }}>Upload Photo</span>
                )}
              </div>
              <label style={{ cursor: "pointer", fontSize: 11, color: B.green, fontWeight: 600, display: "block", textAlign: "center" }}>
                📷 Upload
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload(null, setTeacherImg)} />
              </label>
              {teacherImg && (
                <button onClick={() => setTeacherImg(null)} style={{ display: "block", margin: "4px auto 0", fontSize: 10, color: "#c0504d", background: "none", border: "none", cursor: "pointer" }}>✕ Remove</button>
              )}
            </div>
            <label style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span style={lbl}>Teacher Introduction 老师介绍</span>
              <textarea value={teacherIntro} onChange={e => setTeacherIntro(e.target.value)} rows={6} placeholder="Brief teacher introduction…" style={{ ...inp, resize: "vertical", lineHeight: 1.6, fontSize: 13, background: B.cream }} />
            </label>
          </div>
        </div>

        {/* ═══ PARENT NOTES ═══ */}
        <div style={card}>
          <div style={sectionTitle}>致家长和亲爱的你 <span style={{ fontSize: 10, fontWeight: 400, color: B.muted, textTransform: "none", letterSpacing: 0 }}>(leave blank to hide)</span></div>
          <textarea
            value={parentNotes} onChange={e => setParentNotes(e.target.value)} rows={6}
            placeholder="e.g. 第一节课前，我们必须要做的事情-&#10;• 加入ClassIN 班级&#10;• 下载和打印书籍…"
            style={{ ...inp, resize: "vertical", lineHeight: 1.7, fontSize: 14, background: B.cream }}
          />
        </div>

        {/* ═══ SIGNATURE (Welcome Letter) ═══ */}
        <div style={card}>
          <div style={sectionTitle}>Signature Image 签名图片 <span style={{ fontSize: 10, fontWeight: 400, color: B.muted, textTransform: "none", letterSpacing: 0 }}>(for welcome letter)</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 200, height: 70, background: B.cream, borderRadius: 8, border: `2px dashed ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {signatureImg ? (
                <img src={signatureImg} alt="Signature" style={{ height: "100%", width: "auto", objectFit: "contain" }} />
              ) : (
                <span style={{ fontSize: 11, color: B.muted }}>Upload Signature</span>
              )}
            </div>
            <div>
              <label style={{ cursor: "pointer", fontSize: 12, color: B.green, fontWeight: 600 }}>
                📷 Upload Signature
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload(null, setSignatureImg)} />
              </label>
              {signatureImg && (
                <button onClick={() => setSignatureImg(null)} style={{ display: "block", marginTop: 6, fontSize: 10, color: "#c0504d", background: "none", border: "none", cursor: "pointer" }}>✕ Remove</button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ GENERATE BUTTON ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={generatePDF}
            disabled={generating || !fontsReady}
            style={{
              padding: "14px 36px", background: generating ? B.muted : B.brown, color: B.cream,
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: "inherit",
              cursor: generating ? "wait" : "pointer", boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
              opacity: fontsReady ? 1 : 0.5, transition: "all 0.2s",
            }}
          >
            {!fontsReady ? "Loading fonts…" : generating ? "⏳ Generating…" : "📄 Generate Enrollment PDF"}
          </button>
          {status && <span style={{ fontSize: 13, color: status.startsWith("✓") ? B.green : status.startsWith("Error") ? "#c0504d" : B.muted }}>{status}</span>}
        </div>
      </div>

      {/* ═══ HIDDEN PDF TEMPLATES ═══ */}
      <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1, opacity: 1, pointerEvents: "none" }}>
        <PDFPageWelcome info={info} signatureImg={signatureImg} />
        <PDFPageInfo info={info} qrImages={qrImages} />
        <PDFPageDetails
          info={info}
          schedule={schedule}
          literacyAbout={literacyAbout}
          literacyOverview={literacyOverview}
          writingOverview={writingOverview}
          teacherImg={teacherImg}
          teacherIntro={teacherIntro}
          parentNotes={parentNotes}
        />
        <PDFPageTerms />
      </div>
    </div>
  );
}
