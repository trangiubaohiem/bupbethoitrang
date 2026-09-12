const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src/data/fashionItems.js');

let importsCode = `/**
 * Outfit Sets Data — Complete 60 UNIQUE outfit sets (4 sets per Map x 15 Maps)
 * Every single set features its own UNIQUE, vibrant anime chibi doll artwork on a clean background!
 */

import defaultPink from '../assets/outfits/default_pink.png';
`;

for (let map = 1; map <= 15; map++) {
  importsCode += `import set_m${map}_2star from '../assets/outfits/set_m${map}_2star.png';\n`;
  importsCode += `import set_m${map}_3star from '../assets/outfits/set_m${map}_3star.png';\n`;
  importsCode += `import set_m${map}_epic from '../assets/outfits/set_m${map}_epic.png';\n`;
  importsCode += `import set_m${map}_legendary from '../assets/outfits/set_m${map}_legendary.png';\n`;
}

const setsData = `
export const RARITY = {
  common:    { name: 'Thường',       color: '#8B7AA0', stars: 1 },
  uncommon:  { name: 'Đẹp (2★)',     color: '#5B9BD5', stars: 2 },
  rare:      { name: 'Hiếm (3★)',    color: '#B088F9', stars: 3 },
  epic:      { name: 'Sử Thi (4★)',  color: '#FF85A2', stars: 4 },
  legendary: { name: 'Huyền Thoại (5★)', color: '#FFD700', stars: 5 },
};

export const OUTFIT_SETS = [
  // ===== DEFAULT =====
  {
    id: 'default_pink',
    name: 'Công chúa Hồng Cơ Bản',
    description: 'Bộ trang phục mặc định xinh xắn để bắt đầu cuộc phiêu lưu!',
    image: defaultPink,
    chapter: null,
    rarity: 'common',
    price: 0,
    isDefault: true,
    theme: '🌸 Cơ Bản',
    details: 'Váy hồng công chúa, tóc nâu xoăn dài, nơ hồng, mắt xanh',
  },

  // ===== MAP 1: Vườn Hoa Pha Lê (Lớp 1) =====
  { id: 'm1_2star', name: 'Cô Bé Bọ Rùa Vườn Hoa', description: 'Bộ đồ bọ rùa 2 sao xinh xắn rực rỡ sắc màu vườn hoa!', image: set_m1_2star, chapter: 1, rarity: 'uncommon', price: 40, theme: '🌺 Vườn Hoa Pha Lê' },
  { id: 'm1_3star', name: 'Công Chúa Hoa Đào Tinh Khôi', description: 'Váy xếp tầng cánh hoa 3 sao với nơ lụa mộng mơ!', image: set_m1_3star, chapter: 1, rarity: 'rare', price: 70, theme: '🌺 Vườn Hoa Pha Lê' },
  { id: 'm1_epic', name: 'Tiên Nữ Hoa Pha Lê Sử Thi', description: 'Trang phục tiên nữ 4 sao với cánh bướm hoa pha lê kiều sa!', image: set_m1_epic, chapter: 1, rarity: 'epic', price: 130, theme: '🌺 Vườn Hoa Pha Lê' },
  { id: 'm1_legendary', name: 'Nữ Hoàng Hoa Pha Lê Tối Thượng', description: 'Trang phục hoa đào pha lê 5 sao dát vàng 24K chói lọi!', image: set_m1_legendary, chapter: 1, rarity: 'legendary', price: 0, purplePrice: 15, isPurpleGem: true, theme: '🌺 Vườn Hoa Pha Lê' },

  // ===== MAP 2: Bến Cảng Ngọc Trai (Lớp 1) =====
  { id: 'm2_2star', name: 'Thủy Thủ Nhí Biển Xanh', description: 'Bộ đồ thủy thủ 2 sao năng động khám phá đại dương!', image: set_m2_2star, chapter: 2, rarity: 'uncommon', price: 50, theme: '🌊 Bến Cảng Ngọc Trai' },
  { id: 'm2_3star', name: 'Nàng Tiên Cá Ngọc Trai', description: 'Váy vảy cá 3 sao lấp lánh đính kẹp vỏ sò ngọc bích!', image: set_m2_3star, chapter: 2, rarity: 'rare', price: 80, theme: '🌊 Bến Cảng Ngọc Trai' },
  { id: 'm2_epic', name: 'Nữ Hoàng San Hộ Sử Thi', description: 'Áo đầm lụa san hô 4 sao kiêu sa quyến rũ!', image: set_m2_epic, chapter: 2, rarity: 'epic', price: 140, theme: '🌊 Bến Cảng Ngọc Trai' },
  { id: 'm2_legendary', name: 'Nữ Hoàng Đại Dương Ngọc Trai', description: 'Bộ lụa rồng biển 5 sao tỏa hào quang thủy triều huyền thoại!', image: set_m2_legendary, chapter: 2, rarity: 'legendary', price: 0, purplePrice: 16, isPurpleGem: true, theme: '🌊 Bến Cảng Ngọc Trai' },

  // ===== MAP 3: Đồi Sao Băng (Lớp 1) =====
  { id: 'm3_2star', name: 'Học Việc Tinh Tú', description: 'Bộ đồ ngắm sao 2 sao đáng yêu với áo choàng chòm sao!', image: set_m3_2star, chapter: 3, rarity: 'uncommon', price: 60, theme: '⭐ Đồi Sao Băng' },
  { id: 'm3_3star', name: 'Nhà Thiên Văn Ngôi Sao', description: 'Áo choàng dạ hội 3 sao với thấu kính ma thuật tinh tú!', image: set_m3_3star, chapter: 3, rarity: 'rare', price: 90, theme: '⭐ Đồi Sao Băng' },
  { id: 'm3_epic', name: 'Phù Thủy Sao Băng Sử Thi', description: 'Trang phục 4 sao huyền bí đính gậy phép chòm sao!', image: set_m3_epic, chapter: 3, rarity: 'epic', price: 150, theme: '⭐ Đồi Sao Băng' },
  { id: 'm3_legendary', name: 'Chúa Tể Tinh Hà Sao Băng', description: 'Trang phục 5 sao lụa thiên hà chứa hàng ngàn dải ngân hà lấp lánh!', image: set_m3_legendary, chapter: 3, rarity: 'legendary', price: 0, purplePrice: 17, isPurpleGem: true, theme: '⭐ Đồi Sao Băng' },

  // ===== MAP 4: Thị Trấn Kẹo Ngọt (Lớp 1) =====
  { id: 'm4_2star', name: 'Đầu Bếp Dâu Tây Bánh Ngọt', description: 'Bộ đồ 2 sao với mũ nơ dâu tây mộng mơ!', image: set_m4_2star, chapter: 4, rarity: 'uncommon', price: 70, theme: '🍰 Thị Trấn Kẹo Ngọt' },
  { id: 'm4_3star', name: 'Công Chúa Kẹo Bơ Pastel', description: 'Váy kẹo bông 3 sao pastel ngọt ngào!', image: set_m4_3star, chapter: 4, rarity: 'rare', price: 100, theme: '🍰 Thị Trấn Kẹo Ngọt' },
  { id: 'm4_epic', name: 'Phù Thủy Bánh Kẹo Sử Thi', description: 'Bộ đồ 4 sao chế tạo bánh kẹo ma thuật đỉnh cao!', image: set_m4_epic, chapter: 4, rarity: 'epic', price: 160, theme: '🍰 Thị Trấn Kẹo Ngọt' },
  { id: 'm4_legendary', name: 'Nữ Hoàng Vương Quốc Kẹo Bơ', description: 'Bộ công chúa kẹo đường 5 sao đính ren dát vàng!', image: set_m4_legendary, chapter: 4, rarity: 'legendary', price: 0, purplePrice: 18, isPurpleGem: true, theme: '🍰 Thị Trấn Kẹo Ngọt' },

  // ===== MAP 5: Vương Quốc Cổ Tích (Lớp 1) =====
  { id: 'm5_2star', name: 'Thiếu Nữ Cổ Tích', description: 'Bộ váy 2 sao cổ tích dịu dàng xinh xắn!', image: set_m5_2star, chapter: 5, rarity: 'uncommon', price: 80, theme: '🦄 Vương Quốc Cổ Tích' },
  { id: 'm5_3star', name: 'Công Chúa Hoàng Gia Cổ Tích', description: 'Bộ váy dạ hội 3 sao với vương miện hoàng gia!', image: set_m5_3star, chapter: 5, rarity: 'rare', price: 110, theme: '🦄 Vương Quốc Cổ Tích' },
  { id: 'm5_epic', name: 'Nữ Hoàng Cổ Tích Kim Cương', description: 'Bộ lụa 4 sao kiêu sa quyền uy vàng óng!', image: set_m5_epic, chapter: 5, rarity: 'epic', price: 170, theme: '🦄 Vương Quốc Cổ Tích' },
  { id: 'm5_legendary', name: 'Nữ Thần Thái Dương Cổ Tích', description: 'Trang phục dát vàng 24K 5 sao rực rỡ hào quang mặt trời!', image: set_m5_legendary, chapter: 5, rarity: 'legendary', price: 0, purplePrice: 19, isPurpleGem: true, theme: '🦄 Vương Quốc Cổ Tích' },

  // ===== MAP 6: Lâu Đài Hoàng Gia (Lớp 2) =====
  { id: 'm6_2star', name: 'Nữ Hộ Vệ Lâu Đài', description: 'Bộ trang phục 2 sao hộ vệ lâu dài thanh lịch!', image: set_m6_2star, chapter: 6, rarity: 'uncommon', price: 90, theme: '👑 Lâu Đài Hoàng Gia' },
  { id: 'm6_3star', name: 'Idol Hoàng Gia Ngôi Sao', description: 'Bộ đồ 3 sao idol lẫy lừng lâu đài hoàng gia!', image: set_m6_3star, chapter: 6, rarity: 'rare', price: 120, theme: '👑 Lâu Đài Hoàng Gia' },
  { id: 'm6_epic', name: 'Công Chúa Hoàng Gia Kim Cương', description: 'Váy dạ hội 4 sao sang trọng dát vàng kim đính đá!', image: set_m6_epic, chapter: 6, rarity: 'epic', price: 180, theme: '👑 Lâu Đài Hoàng Gia' },
  { id: 'm6_legendary', name: 'Nữ Hoàng Hoàng Gia Tối Thượng', description: 'Bộ cánh 5 sao tối thượng lộng lẫy nhất cung điện!', image: set_m6_legendary, chapter: 6, rarity: 'legendary', price: 0, purplePrice: 20, isPurpleGem: true, theme: '👑 Lâu Đài Hoàng Gia' },

  // ===== MAP 7: Rừng Nấm Phép Thuật (Lớp 2) =====
  { id: 'm7_2star', name: 'Tiên Nấm Đốm Đỏ', description: 'Bộ đồ 2 sao tiên nấm siêu dễ thương!', image: set_m7_2star, chapter: 7, rarity: 'uncommon', price: 100, theme: '🍄 Rừng Nấm Phép Thuật' },
  { id: 'm7_3star', name: 'Hộ Vệ Tinh Linh Rừng Nấm', description: 'Trang phục 3 sao tinh linh rừng với sáo trúc ma thuật!', image: set_m7_3star, chapter: 7, rarity: 'rare', price: 130, theme: '🍄 Rừng Nấm Phép Thuật' },
  { id: 'm7_epic', name: 'Kiểm Lâm Rừng Nấm Sử Thi', description: 'Áo choàng 4 sao kiểm lâm với sừng hươu dạ quang!', image: set_m7_epic, chapter: 7, rarity: 'epic', price: 190, theme: '🍄 Rừng Nấm Phép Thuật' },
  { id: 'm7_legendary', name: 'Nữ Thần Rừng Nấm Dạ Quang', description: 'Đầm 5 sao lá bích ngọc tỏa rộng hào quang thần bí!', image: set_m7_legendary, chapter: 7, rarity: 'legendary', price: 0, purplePrice: 20, isPurpleGem: true, theme: '🍄 Rừng Nấm Phép Thuật' },

  // ===== MAP 8: Tháp Đồng Hồ (Lớp 2) =====
  { id: 'm8_2star', name: 'Tập Sự Du Hành Thời Gian', description: 'Bộ đồ 2 sao bánh răng đồng ngược dòng thời gian!', image: set_m8_2star, chapter: 8, rarity: 'uncommon', price: 110, theme: '⏳ Tháp Đồng Hồ' },
  { id: 'm8_3star', name: 'Thiếu Nữ Tháp Đồng Hồ', description: 'Phong cách Steampunk 3 sao bánh răng cổ điển!', image: set_m8_3star, chapter: 8, rarity: 'rare', price: 140, theme: '⏳ Tháp Đồng Hồ' },
  { id: 'm8_epic', name: 'Tiểu Thư Bánh Răng Sử Thi', description: 'Bộ đầm 4 sao với kính bảo hộ ma thuật và đồng hồ cổ!', image: set_m8_epic, chapter: 8, rarity: 'epic', price: 200, theme: '⏳ Tháp Đồng Hồ' },
  { id: 'm8_legendary', name: 'Thiên Thần Bánh Răng Vĩnh Cửu', description: 'Cánh bánh răng 5 sao dát vàng lắc đồng hồ vĩnh cửu!', image: set_m8_legendary, chapter: 8, rarity: 'legendary', price: 0, purplePrice: 21, isPurpleGem: true, theme: '⏳ Tháp Đồng Hồ' },

  // ===== MAP 9: Thung Lũng Rồng Băng (Lớp 2) =====
  { id: 'm9_2star', name: 'Thiếu Nữ Tuyết Băng', description: 'Váy 2 sao viền lông tuyết trắng muốt!', image: set_m9_2star, chapter: 9, rarity: 'uncommon', price: 120, theme: '❄️ Thung Lũng Rồng Băng' },
  { id: 'm9_3star', name: 'Công Chúa Băng Giá Lấp Lánh', description: 'Váy 3 sao xanh băng giá đính vương miện tuyết!', image: set_m9_3star, chapter: 9, rarity: 'rare', price: 150, theme: '❄️ Thung Lũng Rồng Băng' },
  { id: 'm9_epic', name: 'Kỵ Sĩ Tuyết Băng Sử Thi', description: 'Áo giáp 4 sao pha lê tuyết với kiếm băng tinh khiết!', image: set_m9_epic, chapter: 9, rarity: 'epic', price: 210, theme: '❄️ Thung Lũng Rồng Băng' },
  { id: 'm9_legendary', name: 'Nữ Hoàng Băng Tuyết Tối Thượng', description: 'Trang phục 5 sao bão tuyết đính kim cương pha lê bích ngọc!', image: set_m9_legendary, chapter: 9, rarity: 'legendary', price: 0, purplePrice: 22, isPurpleGem: true, theme: '❄️ Thung Lũng Rồng Băng' },

  // ===== MAP 10: Mật Thất Kim Tự Tháp (Lớp 2) =====
  { id: 'm10_2star', name: 'Nhà Thám Hiểm Sa Mạc', description: 'Trang phục 2 sao sa mạc năng động dũng cảm!', image: set_m10_2star, chapter: 10, rarity: 'uncommon', price: 130, theme: '🏜️ Mật Thất Kim Tự Tháp' },
  { id: 'm10_3star', name: 'Nữ Tế Mặt Trời Kim Tự Tháp', description: 'Áo choàng 3 sao Ai Cập đính trượng Ankh thái dương!', image: set_m10_3star, chapter: 10, rarity: 'rare', price: 160, theme: '🏜️ Mật Thất Kim Tự Tháp' },
  { id: 'm10_epic', name: 'Công Chúa Thái Dương Sa Mạc', description: 'Váy 4 sao Ai Cập lấp lánh vương miện dát vàng!', image: set_m10_epic, chapter: 10, rarity: 'epic', price: 220, theme: '🏜️ Mật Thất Kim Tự Tháp' },
  { id: 'm10_legendary', name: 'Nữ Hoàng Sa Mạc Pha Lê', description: 'Trang phục 5 sao Sa Mạc dát vàng bọ dung ngọc bảo!', image: set_m10_legendary, chapter: 10, rarity: 'legendary', price: 0, purplePrice: 23, isPurpleGem: true, theme: '🏜️ Mật Thất Kim Tự Tháp' },

  // ===== MAP 11: Ngân Hà Vô Cực (Lớp 3) =====
  { id: 'm11_2star', name: 'Phi Hành Gia Tinh Tú', description: 'Bộ đầm 2 sao galaxy tương lai rực rỡ!', image: set_m11_2star, chapter: 11, rarity: 'uncommon', price: 140, theme: '🌌 Ngân Hà Vô Cực' },
  { id: 'm11_3star', name: 'Công Chúa Thiên Hà Vô Cực', description: 'Váy 3 sao hologram lấp lánh áo choàng chòm sao!', image: set_m11_3star, chapter: 11, rarity: 'rare', price: 170, theme: '🌌 Ngân Hà Vô Cực' },
  { id: 'm11_epic', name: 'Idol Ngân Hà Sử Thi', description: 'Bộ 4 sao thần tượng ngân hà với micro có cánh!', image: set_m11_epic, chapter: 11, rarity: 'epic', price: 230, theme: '🌌 Ngân Hà Vô Cực' },
  { id: 'm11_legendary', name: 'Nữ Thần Tinh Hà Vô Cực', description: 'Trang phục 5 sao vô cực với vòng ma pháp chòm sao tỏa ánh linh ma!', image: set_m11_legendary, chapter: 11, rarity: 'legendary', price: 0, purplePrice: 24, isPurpleGem: true, theme: '🌌 Ngân Hà Vô Cực' },

  // ===== MAP 12: Đại Dương Atlantis (Lớp 3) =====
  { id: 'm12_2star', name: 'Thủy Thủ Atlantis', description: 'Bộ đồ 2 sao thủy thủ Atlantis kiên cường!', image: set_m12_2star, chapter: 12, rarity: 'uncommon', price: 150, theme: '🧜‍♀️ Đại Dương Atlantis' },
  { id: 'm12_3star', name: 'Công Chúa Thủy Cung Atlantis', description: 'Váy vảy cá 3 sao xanh bích với ngọc trai biển sâu!', image: set_m12_3star, chapter: 12, rarity: 'rare', price: 180, theme: '🧜‍♀️ Đại Dương Atlantis' },
  { id: 'm12_epic', name: 'Nữ Hoàng San Hộ Atlantis Sử Thi', description: 'Bộ 4 sao lụa san hô đỏ kiều sa quý phái!', image: set_m12_epic, chapter: 12, rarity: 'epic', price: 240, theme: '🧜‍♀️ Đại Dương Atlantis' },
  { id: 'm12_legendary', name: 'Nữ Thần Thủy Cung Atlantis Supreme', description: 'Đầm 5 sao rồng biển Atlantis tỏa hào quang thủy triều ngọc bích!', image: set_m12_legendary, chapter: 12, rarity: 'legendary', price: 0, purplePrice: 25, isPurpleGem: true, theme: '🧜‍♀️ Đại Dương Atlantis' },

  // ===== MAP 13: Núi Lửa Thái Dương (Lớp 3) =====
  { id: 'm13_2star', name: 'Thiếu Nữ Ngọn Lửa Thái Dương', description: 'Bộ 2 sao ngọn lửa ấm áp của miền thái dương!', image: set_m13_2star, chapter: 13, rarity: 'uncommon', price: 160, theme: '☀️ Núi Lửa Thái Dương' },
  { id: 'm13_3star', name: 'Pháp Sư Thái Dương', description: 'Bộ 3 sao pháp sư lửa với trượng mặt trời!', image: set_m13_3star, chapter: 13, rarity: 'rare', price: 190, theme: '☀️ Núi Lửa Thái Dương' },
  { id: 'm13_epic', name: 'Phượng Hoàng Thái Dương Sử Thi', description: 'Váy 4 sao lửa phượng hoàng chói lọi rực rỡ!', image: set_m13_epic, chapter: 13, rarity: 'epic', price: 250, theme: '☀️ Núi Lửa Thái Dương' },
  { id: 'm13_legendary', name: 'Nữ Hoàng Thái Dương Vũ Trụ', description: 'Bộ dát vàng 24K 5 sao hào quang thái dương tối thượng!', image: set_m13_legendary, chapter: 13, rarity: 'legendary', price: 0, purplePrice: 26, isPurpleGem: true, theme: '☀️ Núi Lửa Thái Dương' },

  // ===== MAP 14: Tháp Phù Thủy Tinh Tú (Lớp 3) =====
  { id: 'm14_2star', name: 'Tập Sự Phù Thủy Tinh Tú', description: 'Bộ 2 sao áo choàng phù thủy nhí mộng mơ!', image: set_m14_2star, chapter: 14, rarity: 'uncommon', price: 170, theme: '🔮 Tháp Phù Thủy Tinh Tú' },
  { id: 'm14_3star', name: 'Phù Thủy Tinh Tú Ma Thuật', description: 'Áo choàng 3 sao tinh tú đính gậy phép phép thuật!', image: set_m14_3star, chapter: 14, rarity: 'rare', price: 200, theme: '🔮 Tháp Phù Thủy Tinh Tú' },
  { id: 'm14_epic', name: 'Nữ Thần Vũ Trụ Tinh Tú Sử Thi', description: 'Váy 4 sao dạ quang ngân hà tỏa ánh tinh vân!', image: set_m14_epic, chapter: 14, rarity: 'epic', price: 260, theme: '🔮 Tháp Phù Thủy Tinh Tú' },
  { id: 'm14_legendary', name: 'Đại Nữ Thần Tinh Tú Tháp Cổ', description: 'Bộ 5 sao chòm sao vĩnh hằng tỏa ánh hào quang tinh tú!', image: set_m14_legendary, chapter: 14, rarity: 'legendary', price: 0, purplePrice: 27, isPurpleGem: true, theme: '🔮 Tháp Phù Thủy Tinh Tú' },

  // ===== MAP 15: Đền Thần Vũ Trụ Supreme (Lớp 3) =====
  { id: 'm15_2star', name: 'Kỵ Sĩ Vũ Trụ Supreme', description: 'Trang phục 2 sao kỵ sĩ đền thần dũng cảm!', image: set_m15_2star, chapter: 15, rarity: 'uncommon', price: 180, theme: '✨ Đền Thần Vũ Trụ Supreme' },
  { id: 'm15_3star', name: 'Nữ Tế Vũ Trụ Supreme', description: 'Bộ 3 sao nữ tế đền thần linh thiêng!', image: set_m15_3star, chapter: 15, rarity: 'rare', price: 210, theme: '✨ Đền Thần Vũ Trụ Supreme' },
  { id: 'm15_epic', name: 'Nữ Hoàng Vũ Trụ Supreme Sử Thi', description: 'Trang phục 4 sao tối thượng linh ma vĩnh hằng!', image: set_m15_epic, chapter: 15, rarity: 'epic', price: 280, theme: '✨ Đền Thần Vũ Trụ Supreme' },
  { id: 'm15_legendary', name: 'Đại Nữ Thần Vũ Trụ Supreme Tối Thượng', description: 'Bộ 5 sao tối cao lộng lẫy đỉnh cao nhất của vũ trụ Fashionia!', image: set_m15_legendary, chapter: 15, rarity: 'legendary', price: 0, purplePrice: 30, isPurpleGem: true, theme: '✨ Đền Thần Vũ Trụ Supreme' },
];

export function getOutfitById(id) {
  return OUTFIT_SETS.find(o => o.id === id);
}

export function getOutfitsByChapter(chapterId) {
  return OUTFIT_SETS.filter(o => o.chapter === chapterId || o.chapter === null);
}

export function getDefaultOutfits() {
  return OUTFIT_SETS.filter(o => o.isDefault).map(o => o.id);
}

export function getAllOutfits() {
  return OUTFIT_SETS;
}

export function canOutfitPlayChapter(outfitId, chapterId) {
  const outfit = getOutfitById(outfitId);
  if (!outfit) return false;
  if (outfit.chapter === chapterId) return true;
  if (outfit.chapter === null && chapterId === 1) return true;
  return false;
}

export function getOwnedOutfitsForChapter(unlockedOutfitIds, chapterId) {
  return OUTFIT_SETS.filter(o => 
    (o.chapter === chapterId || (o.chapter === null && chapterId === 1)) &&
    unlockedOutfitIds?.includes(o.id)
  );
}
`;

fs.writeFileSync(targetPath, importsCode + setsData);
console.log('✓ Successfully mapped all 60 UNIQUE outfit PNG assets in fashionItems.js!');
