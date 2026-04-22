import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">Everything Shop</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              ຮ້ານຄ້າອອນລາຍຂາຍເຄື່ອງໃຊ້ຄົບວົງຈອນ
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold">ຊ໋ອບປິ້ງ</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ສິນຄ້າທັງໝົດ
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ກະຕ່າສິນຄ້າ
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold">ບັນຊີ</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/account"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ຂໍ້ມູນສ່ວນຕົວ
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ປະຫວັດການສັ່ງຊື້
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold">ຕິດຕໍ່ພວກເຮົາ</h4>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted-foreground">
                support@everythingshop.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Everything Shop. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
