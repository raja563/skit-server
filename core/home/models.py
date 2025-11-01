import uuid
import re
from datetime import datetime

from django.db import models
from django.utils import timezone, text
from django.db.models import Max, IntegerField, ExpressionWrapper
from django.db.models.functions import Right
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.text import slugify

# from .models import Student

class Person(models.Model):
    fname = models.CharField(max_length=30, default="")
    lname = models.CharField(max_length=30, default="")
    email = models.EmailField(default="")
    password = models.CharField(max_length=15, default="")


class Enquiry(models.Model):
    name = models.CharField()
    phone = models.CharField(default="")
    email = models.EmailField()
    address = models.CharField(default="")
    subject = models.CharField()
    message = models.TextField()


# --------------------------
# ✅ STUDENT MODEL
# --------------------------
class Student(models.Model):
    student_id = models.CharField(
        max_length=20, unique=True, editable=True, default='', null=True, blank=True
    )
    session = models.CharField(default='', max_length=20)
    course = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    father = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    address = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    email = models.EmailField(default='')

    # Store the student’s photo for recognition
    image = models.ImageField(upload_to='students/images', blank=True, null=True)

    # Optional: Signature or other assets
    sign = models.ImageField(upload_to='students/sign', blank=True, null=True)

    # ⚙️ Encoded facial data (to store face embedding for faster matching)
    face_encoding = models.BinaryField(blank=True, null=True)

    def __str__(self):
        return f"{self.student_id} - {self.name}"


# --------------------------
# ✅ AUTO GENERATE STUDENT ID
# --------------------------
@receiver(pre_save, sender=Student)
def generate_student_id(sender, instance, **kwargs):
    if instance.student_id:
        return

    # Get first 3 chars of name (uppercase, no space)
    name_part = re.sub(r'\s+', '', instance.name.upper())[:3].ljust(3, 'X')

    # Get last 2 digits of current year
    year_part = datetime.now().strftime('%y')

    prefix = f"{name_part}{year_part}"

    # Find highest suffix from all existing student IDs
    latest_suffix = (
        Student.objects
        .annotate(suffix=ExpressionWrapper(Right('student_id', 3), output_field=IntegerField()))
        .aggregate(max_suffix=Max('suffix'))['max_suffix']
    )

    next_suffix = (latest_suffix or 0) + 1
    instance.student_id = f"{prefix}{next_suffix:03d}"


# --------------------------
# ✅ ATTENDANCE SESSION
# --------------------------
class Attendance(models.Model):
    """Represents one attendance session (specific date & course)."""
    course = models.CharField(max_length=100)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course} - {self.date}"
# --------------------------
# ✅ ATTENDANCE RECORD MODEL (Final)
# --------------------------
from django.db import models
from django.utils import timezone

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Out', 'Out'),
    ]

    # 🔗 Foreign key to Student model
    student = models.ForeignKey('Student', on_delete=models.CASCADE)

    # 🧩 Redundant info for record keeping
    student_code = models.CharField(max_length=20, blank=True, null=True)  # student_id from Student
    name = models.CharField(max_length=100, blank=True, null=True)
    course = models.CharField(max_length=100, blank=True, null=True)
    session = models.CharField(max_length=50, blank=True, null=True)

    # 📅 Attendance details
    date = models.DateField(default=timezone.localdate)
    day = models.CharField(max_length=20, blank=True, null=True)
    month = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Present')

    # ⏰ Time fields
    time_in = models.DateTimeField(blank=True, null=True)
    time_out = models.DateTimeField(blank=True, null=True)

    # 🧠 Face recognition verification
    verified_by_face = models.BooleanField(default=False)
    confidence_score = models.FloatField(blank=True, null=True)

    # --------------------------
    # ⚙️ Auto-fill logic
    # --------------------------
    def save(self, *args, **kwargs):
        # Copy info from Student model for record-keeping
        if self.student:
            self.student_code = self.student.student_id
            self.name = self.student.name
            self.course = self.student.course
            self.session = self.student.session

        # Auto-fill month and day
        if not self.month:
            self.month = self.date.strftime("%B")
        if not self.day:
            self.day = self.date.strftime("%A")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.date} ({self.status})"

    class Meta:
        # 🛡️ Ensure only one record per student per date
        unique_together = ('student', 'date')
        ordering = ['-date', 'time_in']

 

class FacultyMember(models.Model):
    fullname = models.CharField(max_length=100)
    fname = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    dobirth = models.DateField()
    address = models.CharField(max_length=200)
    mobile = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    qualification = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    dojoin = models.DateField()
    password = models.CharField(max_length=128)  # Hashed password
    profile = models.ImageField(upload_to='FacultyProfile', blank=True, null=True)
    resume = models.FileField(upload_to='FacultyResume', blank=True, null=True)

    def __str__(self):
        return self.fullname

class FacultyToken(models.Model):
    faculty = models.OneToOneField(FacultyMember, on_delete=models.CASCADE)
    key = models.CharField(max_length=40, default=uuid.uuid4, unique=True)

    def __str__(self):
        return f"{self.faculty.fullname} - Token"


class Syllabus(models.Model):
    course = models.CharField()
    year = models.CharField()
    syllabus = models.FileField(upload_to='syllabus', blank=False)

class DecideFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_fees'
    )

    decidedamt = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

class DecideExamFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_exam_fees',
    )

    decidedexamfee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

class DecideHostelFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_hostel_fees',
    )

    decidedhostelfee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

class DecideTransportFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_transport_fees',
    )

    decidedtransportfee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"


class DpFees(models.Model):
    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='deposite_academic_fees',
    )
    name = models.CharField(max_length=100)
    session = models.CharField(max_length=50)
    course = models.CharField(max_length=50)
    year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)

    decide_fees = models.DecimalField(max_digits=10, decimal_places=2)
    dpfees = models.DecimalField(max_digits=10, decimal_places=2)
    pending = models.DecimalField(max_digits=10, decimal_places=2)
    remark = models.TextField(blank=True, null=True)

    payment_mode = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    receipt = models.CharField(max_length=20, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-generate receipt if not set
        if not self.receipt:
            last_id = DpFees.objects.all().count() + 1
            self.receipt = f"RCPT{last_id:05d}"  # RCPT00001 format
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.receipt}"
 

# Create your models here.

class Person(models.Model):
    # name = models.CharField(max_length=100)
    # age = models.IntegerField()
    fname = models.CharField(max_length=30, default="")
    lname = models.CharField(max_length=30, default="")
    email = models.EmailField(default="")
    password = models.CharField(max_length=15, default="")


class Enquiry(models.Model):
    name = models.CharField()
    phone = models.CharField(default="")
    email = models.EmailField()
    address = models.CharField(default="")
    subject = models.CharField()
    message = models.TextField()

# quick enquiry 
class QuickEnquiry(models.Model):
    name = models.CharField()
    mobile = models.CharField(default="")
    email = models.EmailField()
    course = models.CharField()

class Faculty(models.Model):
    fullname = models.CharField()
    fname = models.CharField()
    gender = models.CharField()
    dobirth = models.DateField()
    address = models.CharField()
    mobile = models.CharField()
    email = models.EmailField()
    qualification = models.CharField()
    department = models.CharField()
    dojoin = models.DateField()

class Syllabus(models.Model):
    course = models.CharField()
    year = models.CharField()
    syllabus = models.FileField(upload_to='syllabus', blank=False)


class DecideFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_fees'
    )

    decidedamt = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

class DecideExamFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_exam_fees',
    )

    decidedexamfee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

class DecideHostelFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_hostel_fees',
    )

    decidedhostelfee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

class DecideTransportFees(models.Model):
    session = models.CharField(max_length=50, default='')
    course = models.CharField(max_length=100, default='')

    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='decide_transport_fees',
    )

    decidedtransportfee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student} - {self.session}"

# deposite Academics fee 
class DpFees(models.Model):
    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='deposite_academics_fees',
    )
    name = models.CharField(max_length=100)
    session = models.CharField(max_length=50)
    course = models.CharField(max_length=50)
    year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)

    decide_fees = models.DecimalField(max_digits=10, decimal_places=2)
    dpfees = models.DecimalField(max_digits=10, decimal_places=2)
    pending = models.DecimalField(max_digits=10, decimal_places=2)
    remark = models.TextField(blank=True, null=True)

    payment_mode = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    receipt = models.CharField(max_length=20, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.receipt:
            prefix = "ACD"  # HOS for Hostel
            year_suffix = now().strftime('%y')  # e.g., '25' for 2025
            base_code = f"{prefix}{year_suffix}"

            # Count how many existing receipts match this base pattern
            existing_receipts = DpFees.objects.filter(receipt__startswith=base_code).count()
            unique_number = existing_receipts + 1
            self.receipt = f"{base_code}{unique_number:05d}"  # e.g., HOS2500001

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.receipt}"


# deposite exam fee 
class DpExamFees(models.Model):
    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='deposite_exam_fees',
    )
    name = models.CharField(max_length=100)
    session = models.CharField(max_length=50)
    course = models.CharField(max_length=50)
    year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)

    decide_fees = models.DecimalField(max_digits=10, decimal_places=2)
    dpexamfees = models.DecimalField(max_digits=10, decimal_places=2)
    pending = models.DecimalField(max_digits=10, decimal_places=2)
    remark = models.TextField(blank=True, null=True)

    payment_mode = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    receipt = models.CharField(max_length=30)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.receipt:
            prefix = "EXM"  # HOS for Hostel
            year_suffix = now().strftime('%y')  # e.g., '25' for 2025
            base_code = f"{prefix}{year_suffix}"

            # Count how many existing receipts match this base pattern
            existing_receipts = DpExamFees.objects.filter(receipt__startswith=base_code).count()
            unique_number = existing_receipts + 1
            self.receipt = f"{base_code}{unique_number:05d}"  # e.g., HOS2500001

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.receipt}"

# deposite Hostel fee 
from django.utils.timezone import now
class DpHostelFees(models.Model):
    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='deposite_hostel_fees',
    )
    name = models.CharField(max_length=100)
    session = models.CharField(max_length=50)
    course = models.CharField(max_length=50)
    year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)

    decide_fees = models.DecimalField(max_digits=10, decimal_places=2)
    dphostelfees = models.DecimalField(max_digits=10, decimal_places=2)
    pending = models.DecimalField(max_digits=10, decimal_places=2)
    remark = models.TextField(blank=True, null=True)

    payment_mode = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    receipt = models.CharField(max_length=20, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.receipt:
            prefix = "HST"  # HOS for Hostel
            year_suffix = now().strftime('%y')  # e.g., '25' for 2025
            base_code = f"{prefix}{year_suffix}"

            # Count how many existing receipts match this base pattern
            existing_receipts = DpHostelFees.objects.filter(receipt__startswith=base_code).count()
            unique_number = existing_receipts + 1
            self.receipt = f"{base_code}{unique_number:05d}"  # e.g., HOS2500001

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.receipt}"

# deposite Transportation fee 
class DpTransportFees(models.Model):
    student = models.ForeignKey(  # ← rename to 'student' for DRF best practices
        Student,
        to_field='student_id',   # ← you're linking to custom field
        on_delete=models.CASCADE,
        related_name='deposite_transport_fees',
    )
    name = models.CharField(max_length=100)
    session = models.CharField(max_length=50)
    course = models.CharField(max_length=50)
    year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)

    decide_fees = models.DecimalField(max_digits=10, decimal_places=2)
    dpTransportfees = models.DecimalField(max_digits=10, decimal_places=2)
    pending = models.DecimalField(max_digits=10, decimal_places=2)
    remark = models.TextField(blank=True, null=True)

    payment_mode = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    receipt = models.CharField(max_length=20, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.receipt:
            prefix = "TRN"  # HOS for Hostel
            year_suffix = now().strftime('%y')  # e.g., '25' for 2025
            base_code = f"{prefix}{year_suffix}"

            # Count how many existing receipts match this base pattern
            existing_receipts = DpTransportFees.objects.filter(receipt__startswith=base_code).count()
            unique_number = existing_receipts + 1
            self.receipt = f"{base_code}{unique_number:05d}"  # e.g., HOS2500001

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.receipt}"





GENDER_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Other', 'Other'),
]

class Staff(models.Model):
    staff_id = models.CharField(max_length=20, unique=True, blank=True)
    name = models.CharField(max_length=100)
    father = models.CharField(max_length=100)
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    dateofbirth = models.DateField()
    adhar = models.CharField(max_length=12, unique=True)
    mobile = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    profile = models.ImageField(upload_to='staff_profiles/', blank=True, null=True)
    resume = models.FileField(upload_to='staff_resumes/', blank=True, null=True)
    department = models.CharField(max_length=100)
    date_of_join = models.DateField()
    skills = models.JSONField(default=list)
    maxQualification = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        if not self.staff_id:
            prefix = "S"  # HOS for Hostel
            year_suffix = now().strftime('%y')  # e.g., '25' for 2025
            base_code = f"{prefix}{year_suffix}"

            # Count how many existing receipts match this base pattern
            existing_receipts = Staff.objects.filter(staff_id__startswith=base_code).count()
            unique_number = existing_receipts + 1
            self.staff_id = f"{base_code}{unique_number:03d}"  # e.g., HOS2500001

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.staff_id}"

 

class Career(models.Model):
    name = models.CharField(max_length=100)  # Full name of the applicant
    address = models.TextField()  # Detailed address
    phone = models.CharField(max_length=15)  # Phone number with country code support
    email = models.EmailField(max_length=100)  # Email for communication
    position_applied = models.CharField(max_length=100)  # Job role they are applying for
    qualification = models.CharField(max_length=200)  # Highest qualification
    experience = models.CharField(max_length=100)  # Work experience
    resume = models.FileField(upload_to='resumes/')  # File upload for resume (PDF, DOC, etc.)
    applied_on = models.DateTimeField(auto_now_add=True)  # Automatically store application date

    def __str__(self):
        return f"{self.name} - {self.position_applied}"
    