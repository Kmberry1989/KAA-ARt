export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto text-center py-6 text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ARt Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
}
